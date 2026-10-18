# Multiverse: Toy Story (TS1–TS12)

## TS1. The New Toy

*Toy Story (Pixar, 1995): Andy’s birthday* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: Any time once the Multiverse rift is open; first storyline of the Toy Story line

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Rex (Rex the dinosaur (Pixar, Toy Story)), Hamm (Hamm the piggy bank (Pixar, Toy Story)), Sarge (Sarge of the green army men (Pixar, Toy Story)), Bo Peep (Bo Peep (Pixar, Toy Story 1, 2 and 4)), Plush Nubbin (The plush Nubbin from fun quest Q12, Just Resting (original))

### Step 1: Get the army men downstairs and report Andy’s birthday presents over the baby monitor.

Hint: A stealth expedition. Freeze whenever a grown-up looks your way: humans must never see a toy move. · check: `expedition:complete:mv-ts-birthday-recon:stealth`

#### Scene `mv-ts01-meeting`

_The rift drops you onto a bedspread printed with cowboys. Everything is enormous, and you are about the height of a pencil._  
_Your joints click, there’s a seam down your side, and a little painted lantern is moulded into your hand. You have turned into a toy._  
_Your Nubbins are toys too: soft, stitched, with fabric tags on their bottoms. They seem delighted about it._  
**Woody** _(happy)_: Whoa, hold it. New faces. Nobody panic. Name’s Woody. I run things up here, more or less.  
**Woody** _(think)_: You came out of that shimmery thing by the window, so you’re either a birthday present or a fire hazard.  
_The toy box lid lifts. Your plush Nubbin, the one from the shop that never once moved, climbs out and stretches._  
**Plush Nubbin** _(happy)_: Oh. Hello. Please don’t tell the shopkeeper.  
**Woody**: That plush has been in the box a month and never said boo. Figured it was shy.  
**Woody**: Okay, staff meeting. Andy’s birthday party got moved up to today, because the family moves house next week.  
**Rex** _(shock)_: Today? Nobody warned me! What if he gets a dinosaur? A bigger, meaner dinosaur?  
**Hamm**: Then you’ll finally have someone to look up to, Rex.  
**Woody**: Sarge, take your men down. Baby monitor on channel one. I want every present reported before it’s unwrapped.  

**Choices**

- **Send your Nubbins down with the army men.** — sets `{"mv-ts-recon":"nubbins"}`
    - **Sarge**: Fuzzy recruits. They’ll do. A soft landing is a tactical asset.
    - Your Nubbins fall in at the back of the platoon, marching on feet that don’t really bend.
- **Stay up here and hold the monitor with Woody.** — sets `{"mv-ts-recon":"monitor"}`
    - **Woody**: Good. Keep it steady. Rex shakes it when he gets nervous, and Rex is always nervous.
    - **Rex**: That was one time! Several times. A normal number of times.

#### Done `mv-ts01-meeting-done`

**Sarge**: Final package. Large. Shape unknown. The birthday boy is screaming. Repeat, screaming.  
_The monitor cuts out. Feet thunder on the stairs, and every toy on the bed drops where it stands._  
_Something new lands on the bedspread. Andy runs back out for cake, and the room holds its breath._  

### Step 2: Help Buzz “fly” around Andy’s room without anyone seeing how.

Hint: A short race course: ball, car ramp, ceiling plane. Your Nubbins nudge each bounce so Buzz lands back on the bed. · check: `race:finish:mv-ts-bedroom-flight`

#### Scene `mv-ts01-ranger`

_The new toy sits up in the spot where Woody always sits. White armour, purple trim, a dome helmet, and a jaw like a shelf bracket._  
**Buzz Lightyear** _(think)_: Status report. Hull intact. Wings intact. Local life forms primitive, but curious.  
**Buzz Lightyear**: Lightyear. Buzz Lightyear. Space Ranger, Kellen Belt patrol. My ship came down hard. I’ll need a moment.  
**Woody** _(angry)_: Your ship is a cardboard box. You came down from the kitchen table.  
_Buzz presses a button on his wrist, and it beeps and glows red. Rex gasps loud enough to rattle the shelf._  
**Buzz Lightyear**: Careful, cowboy. This arm is rated for asteroid work.  
**Woody** _(angry)_: That is a red bead with a battery behind it. I’ve seen scarier fridge magnets.  
**Bo Peep** _(happy)_: He’s got wings, Woody. Can you blame a girl for asking where they go?  
**Buzz Lightyear**: Ma’am, they go up. Stand back, everyone. I’ll show you.  
_He climbs the bedpost. Your Nubbins look at each other, then at the bouncy ball, the toy car and the plane hanging from the ceiling._  

**Choices**

- **Tell Buzz the truth before he jumps: he’s a toy, like you.** — sets `{"mv-ts-ranger":"told"}`
    - **You**: Buzz. You were in a box this morning. So was I, more or less.
    - **Buzz Lightyear**: Classic space dementia. The rookie’s been in hypersleep too long. Someone get them a blanket.
    - **Woody**: Thank you! Finally! Somebody in this room with eyes!
- **Say nothing. Let him have his moment, and help him land it.** — sets `{"mv-ts-ranger":"let"}`
    - You nod to your Nubbins, and they quietly take up positions by the ball, the ramp and the plane string.
    - **Woody**: You’re helping him? You’re helping the cardboard astronaut?

#### Done `mv-ts01-ranger-done`

_Ball, ramp, plane, one long loop, and Buzz lands back on the bed on one knee. Nobody looks at your Nubbins, who did all of it._  
**Hamm**: Well, I’ll be. Somebody give that man a pension.  
**Woody** _(angry)_: He bounced. He bounced off a ball and got lucky three times in a row. That’s not a skill.  
_Bo hooks her crook round Buzz’s arm to congratulate him. Woody watches the crook for a long time._  

#### Complete `mv-ts01-complete`

_Days go by, and the cowboy curtains come down. Rockets go up on the walls, and Andy runs round the house making engine noises._  
_One night Andy lifts Woody off the bed and drops him into the toy box. Buzz stays on the pillow._  
_Your plush Nubbin is at the bottom of the box, between a puzzle piece and a sock. It moves over to make room._  
**Woody** _(sad)_: So. This is down here.  
**Plush Nubbin**: It’s not so bad. It’s quiet. A man in a shop spent a whole year telling people I was resting.  
**Woody** _(think)_: It doesn’t matter. I’m his favourite. This is a phase. Phases end.  
_Woody says it three more times before he falls asleep. Your plush Nubbin pats his hat each time._  
_In the morning Woody hands you a tin star from his drawer of spare parts. He says it’s for the recon, and won’t say more._  

**Rewards**

- Tin Sheriff Star (cosmetic): A small tin star badge that pins onto any Nubbin. Woody had a spare. He insists it is not a consolation prize.
- Ceiling Plane Mobile (decor): The toy plane Buzz looped around, for the Grove nursery. Nubbins swing on it.

Sets on completion: `{"mv-ts01":true}`

**Notes:** Opens the Toy Story line; needs only the Multiverse rift. Art: on this side of the gate the Keeper is a jointed toy figure holding a painted lantern, and party Nubbins get a plush texture with a fabric tag. Toy scale throughout (a bed is a mountain). Freeze rule: in stealth checks a human seeing a toy move fails the attempt; whenever a human enters a scene, every toy (Keeper included) drops limp mid-pose. Plush rule (see file header; line numbers 0-based): mv-ts01-meeting lines 5–7 and mv-ts01-complete lines 2, 4 and 6 drop when the player has no Q12 plush. Recon: Andy’s living room party, baby monitor static as UI. Bedroom flight course is a race-track reskin with three bounce gates. `mv-ts-ranger` (told/let, added in review) records whether the Keeper told Buzz the truth on day one; it only changes the then-lines, but TS3 lands harder if he was told and laughed it off. Bo hooking Buzz’s arm with her crook is the first sting of Woody’s jealousy; keep it a glance, not a scene. SIGNATURE CHOICE: mv-ts-recon (nubbins | monitor: whether the Nubbins marched with Sarge or you kept the baby monitor) pays off through MV_TOYSTORY_VARIANTS at mv-ts04-crate (how the Nubbins step up for the rule-break), mv-ts08-truck (how they work the horn in the chase) and mv-ts09-plan (which job Woody gives you in the break-out).

## TS2. Pizza Planet

*Toy Story (Pixar, 1995): the window, the gas station and Pizza Planet* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS1, The New Toy · requires: TS1

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Slinky (Slinky Dog (Pixar, Toy Story)), Mr. Potato Head (Mr. Potato Head (Pixar, Toy Story)), Rex (Rex the dinosaur (Pixar, Toy Story)), Hamm (Hamm the piggy bank (Pixar, Toy Story)), The Aliens (The three-eyed claw-machine aliens (Pixar, Toy Story)), Sid (Sid Phillips (Pixar, Toy Story))

### Step 1: Slip into Andy’s backpack with Woody before the car leaves for Pizza Planet.

Hint: Cross the landing while Andy hunts for his shoes. Freeze whenever anyone turns round. · check: `expedition:complete:mv-ts-backpack-dash:stealth`

#### Scene `mv-ts02-window`

_Andy’s mum calls up the stairs: dinner at Pizza Planet, and he can bring one toy. Just one._  
**Woody** _(think)_: One toy. It’s me or the spaceman, and he’s standing right by the desk.  
**Woody**: If he just happened to fall down behind it, nobody would find him for a day or two. Nobody gets hurt.  
_He winds up RC, the remote-control car, and aims it at the desk. Your Nubbins look at the angle and wince._  
_RC bumps the bin, the bin swings the lamp, the lamp catches Buzz, and Buzz sails straight out of the open window._  
_There is a very long silence._  
**Slinky** _(shock)_: Woody. Woody, what did you do?  
**Mr. Potato Head** _(angry)_: He couldn’t stand the competition, so he shoved him out. Textbook.  
**Rex** _(shock)_: In the bedroom! In front of everybody! I’ll never unsee it!  
**Woody** _(shock)_: It was an accident! Tell ’em. You saw it. Tell ’em it was an accident!  

**Choices**

- **Tell them what you saw: it was an accident.** — sets `{"mv-ts-window":"accident"}`
    - **Slinky**: Okay. I believe the little fella. But you owe Buzz an apology the size of a house, Woody.
    - **Hamm**: Accident or not, he’s still out of the window.
- **Say nothing. Woody made this mess.** — sets `{"mv-ts-window":"silent"}`
    - Woody looks at you as if you’ve pushed him out of a window too.
    - **Mr. Potato Head**: See? Even the new kid won’t back you up.

#### Done `mv-ts02-window-done`

_Andy grabs Woody and runs. You and your Nubbins tumble into the side pocket of his backpack._  
_Nobody sees the bush under the window shake, or the spaceman leap for the car’s back bumper._  

### Step 2: Catch the Pizza Planet delivery truck before it pulls out of the gas station.

Hint: A sprint across the forecourt. Put your fastest Nubbin in front to grab the bumper strap. · check: `race:win:mv-ts-pizza-truck`

#### Scene `mv-ts02-gas`

_A gas station at dusk, and Andy’s mum goes in to pay. Through the backpack zip you watch a white helmet rise in the back window._  
**Buzz Lightyear** _(angry)_: Sheriff. You tried to terminate a fellow officer.  
**Woody**: I tried to put you behind a desk! That’s not a crime, that’s furniture!  
_Buzz tackles him, and they roll out of the door, under the car and across an oil stain, still swinging. Your Nubbins go after them._  
_The car starts, and the car pulls away. Woody and Buzz stop fighting at exactly the same moment._  
**Woody** _(sad)_: No. No, no, no. He’s gone. Andy’s gone.  
**Buzz Lightyear** _(think)_: Don’t worry. Star Command will triangulate my position within the hour.  
**Woody** _(angry)_: There is no Star Command! There’s a pizza truck, though.  
_A delivery truck pulls in: a rocket on the roof, a planet on the side, PIZZA PLANET in green neon. It’s going exactly where Andy is._  
**Woody**: Truck leaves in a minute, spaceman. If you want to see your “base”, you run.  

#### Done `mv-ts02-gas-done`

_Your fastest Nubbin reaches the truck first and hangs on to the bumper strap until everyone is aboard._  
**Buzz Lightyear**: Fine work, small one. Remind me to put in a word with your commanding officer.  
**You**: That’s me.  

### Step 3: Keep hold of Buzz when the Claw lifts him out of the machine.

Hint: An expedition inside the claw machine: grab Woody, grab Buzz, and don’t let the Claw split the party. · check: `expedition:complete:mv-ts-claw-machine`

#### Scene `mv-ts02-claw`

_Pizza Planet is loud, dark and blinking. Woody spots Andy’s family across the room and starts planning a route._  
_Buzz spots a giant glass spaceship with a crane on top, and climbs inside before anyone can stop him._  
_Inside, a crowd of little green aliens with three eyes each turn, all together, to face him._  
**The Aliens** _(shock)_: A stranger. From outside the glass. Has the great hand sent him?  
**Buzz Lightyear**: I need a ship and a pilot. Who’s in command here?  
**The Aliens** _(soft)_: The hand above commands. When it descends, one of us rises into the light, and goes beyond.  
**Woody** _(angry)_: Beyond where? Into some kid’s pocket! Buzz, get out of there!  
_A face fills the glass: skull T-shirt, braces, a grin like a broken fence. Woody goes pale under his paint._  
**Woody** _(shock)_: Sid. Sid from next door. He blows toys up. For fun.  
_Sid feeds in his coins. The Claw comes down and closes on Buzz’s helmet, and the aliens sigh like a congregation._  
**The Aliens** _(happy)_: The hand has taken him. Blessed is the stranger.  

**Choices**

- **Grab Buzz’s boots and hang on.** — sets `{"mv-ts-claw":"grabbed"}`
    - You catch a boot, Woody catches you, and your Nubbins catch Woody. The Claw lifts all of you like a bunch of grapes.
- **Ask the aliens to help pull him back.** — sets `{"mv-ts-claw":"asked"}`
    - **The Aliens**: We do not resist the hand. But we may lean.
    - Forty aliens lean the same way at once. The Claw swings wide, and you all go up together.

#### Done `mv-ts02-claw-done`

_Sid unhooks the whole bundle from the Claw and laughs at his luck._  
**Sid** _(happy)_: A spaceman, a cowboy and a load of fluff for one go. Oh, we are going to have a good night.  
_He stuffs everything in his backpack. From somewhere inside it, a squeaky voice says that the hand is wise._  

#### Complete `mv-ts02-complete`

_The backpack bumps along Sid’s street. Through a gap in the zip you can see Andy’s house next door, with every light on._  
**Woody** _(sad)_: So close I could spit on the porch.  
**Buzz Lightyear** _(think)_: Sheriff, I think I owe you a… no. I think you owe me an apology.  
**Woody** _(sad)_: I do. I’m sorry. I am. Six years of being picked first, and I couldn’t stand one week of second.  
**Woody**: That’s the whole ugly truth of it. Now help me think of a way out of here.  
_Then a growl. Sid’s dog, Scud, sniffs the backpack all the way to the front door._  
_In your pocket is a little alien squeeze-charm that came out of the machine with you. It squeaks reverently._  

**Rewards**

- Little Green Antennae (cosmetic): A three-eyed alien headband for any Nubbin. It squeaks reverently when squeezed.
- Claw Machine (decor): A toy-sized claw machine for the Grove. Nubbins take turns being the prize.

Sets on completion: `{"mv-ts02":true}`

**Notes:** Staging: Andy’s bedroom window (the RC accident plays as a fast chain reaction, slow on the final fall); gas station forecourt at dusk (race reskin, the truck pulls away on a timer); Pizza Planet interior, dark with neon. The aliens always speak together: three portraits side by side, one text. They call the claw “the hand” in dialogue; “the Claw” is fine in narration. Sid is never menacing to the player directly here, only gleeful; his menace lands in TS3. Choice flag `mv-ts-window` is cosmetic (Slinky’s attitude in TS3).

## TS3. Sid’s House

*Toy Story (Pixar, 1995): Sid’s room and the commercial* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS2, Pizza Planet · requires: TS2

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Sid (Sid Phillips (Pixar, Toy Story))

### Step 1: Sneak through Sid’s house to the front door while Scud sleeps.

Hint: Stealth. Scud wakes at noise, so move on the rugs and freeze on the floorboards. · check: `expedition:complete:mv-ts-sids-hallway:stealth`

#### Scene `mv-ts03-sid`

_Sid’s room is dark, sticky and full of tools. The bed is unmade, and the bin is full of toy parts._  
_He has a doll pinned to his desk and a pterodactyl head in his hand. He is humming, and it is not a nice tune._  
**Sid** _(happy)_: Dr Sid will now begin the procedure. Nurse, the pliers. Thank you, nurse.  
_When he’s done, the doll has dinosaur jaws, and Sid’s little sister Hannah is screaming for her mum._  
_Sid runs out to chase her. Under his bed, something clicks and starts to crawl._  
_A baby doll’s head on a frame of construction-set legs, a fishing rod with doll’s legs, a duck with a wheel for a body._  
**Woody** _(shock)_: They eat toys. They must eat toys. Look at them! Stay behind me, everybody stay behind me!  
**Buzz Lightyear**: Steady, cowboy. Let me try a universal greeting.  
_Your Nubbins, who are also stitched together out of odds and ends, just walk over to them._  
_The spider-baby lowers its head to your smallest Nubbin, and lets it pat the bald patch._  

**Choices**

- **Trust the strange toys. Ask them the way out.** — sets `{"mv-ts-mutants":"trusted"}`
    - The fishing-rod toy points down the hall, then down the stairs, then at the dog, very firmly.
    - **Woody**: Fine. Fine! But if they eat anybody, I called it.
- **Stick with Woody’s plan and keep clear of them.** — sets `{"mv-ts-mutants":"wary"}`
    - The strange toys watch you go, and nobody follows. If anything, they look a little hurt.
    - **Buzz Lightyear**: They meant no harm, Sheriff. My sensors are rarely wrong.

#### Done `mv-ts03-sid-done`

_Halfway along the landing, Buzz hears a voice from the television downstairs. His own voice._  
_He stops, and you stop with him. Woody keeps going, and doesn’t notice for a long time._  

### Step 2: Get to Buzz after his fall, before Hannah finds him.

Hint: The stairwell is open ground. Go down the banister, not the stairs. · check: `expedition:complete:mv-ts-stairwell`

#### Scene `mv-ts03-advert`

_On the living-room television, a boy swoops a Buzz Lightyear round a shop aisle while an announcer bellows._  
_Then rows of identical Buzzes on a shelf. The voice that says his words was recorded in a factory, and the wings open on a spring._  
_Last comes a line of tiny print along the bottom of the screen. Your Nubbins can’t read it, but Buzz can._  
**Buzz Lightyear** _(shock)_: …That isn’t right. That says I can’t fly.  
**Buzz Lightyear** _(angry)_: It’s a misprint. It’s propaganda. Someone at Star Command is going to hear about this.  
_He climbs the banister to the landing window. The stairwell drops away under him, two whole storeys, a long way for a toy._  
**Buzz Lightyear** _(think)_: Hold on to something. This is it.  
_He spreads his wings and jumps. For one heartbeat you honestly don’t know._  
_Then he drops straight down the stairwell and hits the floor, and his left arm comes off and skids under a table._  
_He lies there looking at the arm. He doesn’t get up._  

#### Done `mv-ts03-advert-done`

_Hannah gets there first. When you find him, he is in a frilled bonnet at her tea table, between two headless dolls._  
**Buzz Lightyear** _(happy)_: Sheriff! Join us. I’m Lady Featherbottom now. I’ve had six cups. They were all empty. It was wonderful.  
**Woody** _(shock)_: Oh, he’s gone. He’s completely gone.  

### Step 3: Help the strange toys put Buzz’s arm back on.

Hint: A crafting job with tape, a screw and patience. Your steadiest Nubbin holds the shoulder still. · check: `craft:mv-ts-buzz-arm`

#### Scene `mv-ts03-arm`

_Back in Sid’s room, Buzz sits on the floor with his loose arm in his good hand. The bonnet is still on._  
**Buzz Lightyear** _(sad)_: Years of training. A galaxy to defend. And I’m a… a stocking filler.  
**Buzz Lightyear**: Batteries sold separately. Wings sold separately. Purpose, apparently, sold separately.  
**Woody** _(sad)_: Buzz, come on. Look at me. You’re a…  
_Woody stops. He doesn’t know how that sentence ends either._  
_The strange toys come out of the shadows. They look at the arm, and at Buzz, and then at your Nubbins, who are already holding tape._  
**Woody** _(angry)_: Wait, what are they doing? Get away from him!  
_Nobody pays him any attention. The fishing-rod toy brings a screwdriver bigger than she is._  
_The spider-baby lays the arm against the shoulder, and waits for somebody to help hold the pieces._  

**Choices**

- **Tell him straight: being a toy isn’t nothing.** — sets `{"mv-ts-buzz-truth":"straight"}`
    - **You**: Somebody wrote his name on your boot. You were wanted before you ever tried to fly.
    - **Buzz Lightyear**: …Andy did, didn’t he. In marker. It tickled.
- **Point out that he looks great in a bonnet.** — sets `{"mv-ts-buzz-truth":"joke"}`
    - **Buzz Lightyear**: …It is a very good bonnet.
    - He almost smiles. Almost is a start.

#### Done `mv-ts03-arm-done`

_The arm clicks home, and Buzz tests the laser: it still glows red. It never did anything, and it never needed to._  
**Woody** _(shock)_: They fixed him. The scary ones fixed him.  
_The spider-baby taps your Nubbin on the head, twice, like a thank-you._  

#### Complete `mv-ts03-complete`

_Sid bursts in holding a parcel. Inside is a firework rocket as long as his arm, with a comet on the box._  
**Sid** _(happy)_: Mail order! I always wanted to know what a spaceman looks like in space.  
_He tapes the rocket to Buzz’s back with a whole roll of tape, for launch at dawn. Then thunder rolls in, and it rains._  
_Sid goes to bed, with Woody shut under a milk crate and a toolbox on top. Buzz sits beside it, strapped to his rocket, watching the rain._  
**Woody** _(sad)_: That window over there is Andy’s. You should be in there, not me. He picked you.  
**Buzz Lightyear** _(soft)_: I keep looking at my boot. His name’s still there. It’s the only thing tonight that makes any sense.  
_Before dawn, one of the strange toys leaves a little wrench by your pack. It is the only gift it has._  

**Rewards**

- Mended-Toy Wrench (item): A tiny wrench from Sid’s strange toys. Use it in the Grove to repair a broken toy or decor item for free.
- Patched Up (title): Title for the Nubbin that held Buzz’s shoulder still. Shown on its stat sheet.

Sets on completion: `{"mv-ts03":true}`

**Notes:** Sid’s mutated toys must read as unsettling for one scene and gentle ever after: low-key light on first sight, warm light once they fix Buzz. Never show anything tearing; Buzz’s arm pops off with a plastic click. The commercial is shown as a toy-scale TV with original art and a silent caption; the “can’t fly” small print is drawn, not voiced. Hannah is off-screen except her voice through the wall (no line). The tea party bonnet stays on Buzz for the rest of the storyline as a cosmetic swap.

## TS4. The Rocket

*Toy Story (Pixar, 1995): the ambush and the moving van* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS3, Sid’s House · requires: TS3

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Mr. Potato Head (Mr. Potato Head (Pixar, Toy Story)), Sarge (Sarge of the green army men (Pixar, Toy Story)), Plush Nubbin (The plush Nubbin from fun quest Q12, Just Resting (original))

### Step 1: Spring the backyard ambush on Sid before the rocket goes up.

Hint: An expedition with timing. Each strange toy takes a position, and your Nubbins rise from the sandpit on Woody’s cue. · check: `expedition:complete:mv-ts-backyard-ambush`

#### Scene `mv-ts04-crate`

_Morning. Through Sid’s window you can see a moving van in Andy’s drive, and boxes going in: Andy’s family leaves today._  
**Woody** _(shock)_: Buzz. Buzz! Get this toolbox off me. We can still make it, both of us.  
**Buzz Lightyear** _(sad)_: Go without me. A toy that can’t fly is a toy nobody will miss.  
**Woody** _(angry)_: I’d miss you! I mean it! Andy put his name on you. Get off your rocket and push!  
_Buzz looks at his boot, then leans his rocket on the toolbox and pushes, and your Nubbins push too. It shifts an inch, then a foot._  
_Woody slides out just as Sid thunders back in, grabs Buzz and runs downstairs to the yard. Launch time._  
**Woody**: All right. There’s a rule, and every toy knows it. We don’t move in front of them. Not ever.  
**Woody**: Today I’m breaking it. Who’s with me?  
_The spider-baby clicks and the fishing-rod toy reels in. Your Nubbins step forward before you can say a word._  

**Choices**

- **Break the rule with him. Let Sid see you move.** — sets `{"mv-ts-rule":"broken"}`
    - **Woody**: Then we do it together. Count of three, and we give him the fright of his life.
- **Stay hidden and work the trap from the drain.** — sets `{"mv-ts-rule":"kept"}`
    - **Woody**: Smart. Somebody ought to keep their nose clean. You pull the strings, I’ll do the talking.

#### Done `mv-ts04-crate-done`

_Sid strikes a match. Then Woody’s voice box says Sid’s name, which it was never built to do._  
**Woody** _(angry)_: Sid. We see what you do in that room. Every toy you’ve broken, we remember.  
_Toys rise out of the sandpit, the mud and the drain. Sid screams, drops everything and runs inside to hide behind his sister._  

### Step 2: Steer RC after the moving van, then ride the rocket into Andy’s car.

Hint: A race on a draining battery. Hug the kerb, and let the rocket do the rest once the fuse catches. · check: `race:win:mv-ts-moving-van`

#### Scene `mv-ts04-van`

_No time to celebrate. The van is pulling out, and Andy’s family car is already round the corner._  
_Woody, Buzz and your Nubbins run. Buzz makes the van’s bumper; Woody doesn’t, until Buzz reaches back and hauls him on._  
_Then Scud comes over the fence at full gallop and gets Woody by the boot._  
_Buzz lets go of the van, lands on the dog’s head and saves him. The van drives off with Woody on it and Buzz in the road._  
**Woody** _(angry)_: I’m not leaving him again. Not ever again. RC!  
_Woody digs RC out of a box marked ANDY’S ROOM. The other toys only see Woody throwing their friend out of a moving van._  
**Mr. Potato Head** _(angry)_: He’s doing it again! Now he’s getting rid of RC!  
_They throw Woody out after RC. He lands on RC’s roof, and RC swerves back for Buzz._  
_Buzz and your Nubbins pile on, and RC’s battery light flickers and goes red. The van keeps pulling away._  
**Buzz Lightyear** _(shock)_: The rocket! Woody, I’m still wearing the rocket!  
**Woody**: And Sid’s match! It’s in my holster! Hold still!  
_The match goes out in the wind. Buzz turns his helmet to the sun, and the bright spot settles on the fuse._  

#### Done `mv-ts04-van-done`

_The rocket kicks and RC drops away. The van’s back doors flash past below you, and you keep going up._  
_Buzz pops his wings and the tape snaps. The rocket goes on alone and bursts like a dandelion high over the street._  
_You glide, more or less, and drop through the open sunroof of Andy’s car into a box beside his seat._  
**Woody** _(happy)_: Buzz! Look at you! Look at you go!  
**Buzz Lightyear** _(happy)_: This is a glide with ambitions. I’ll take it.  

#### Complete `mv-ts04-complete`

_Andy finds two toys in the box and yells for joy. He doesn’t ask how they got there; children never do._  
_Christmas, in the new house. The toys gather on the stairs with the baby monitor again while Sarge’s men report._  
**Sarge**: Present one is… stand by. It’s barking. Repeat, the present is barking.  
**Woody** _(happy)_: A puppy. Well. Can’t be worse than a spaceman.  
**Buzz Lightyear** _(happy)_: I’ll take that as a compliment, Sheriff.  
_Your plush Nubbin has kept Woody’s spot on the new bed warm. It mentions this, twice._  
**Plush Nubbin** _(happy)_: He’s back on the pillow. I’m back in the box. It’s a good box.  
_Buzz gives you one of his wing-tips, which snapped off in the flight. Woody pins it to your pack like a medal._  

**Rewards**

- Rocket Wing-Tip (cosmetic): A snapped-off space-ranger wing-tip, pinned to the pack of any Nubbin like a medal.
- Moving Day (title): Keeper title for surviving the van chase and the rocket. Shown on the Keeper card.

Sets on completion: `{"mv-ts04":true}`

**Notes:** `mv-ts-rule` (broken/kept) only changes the ambush: if broken, the Keeper sprite rises in plain sight with the strange toys; if kept, the Keeper works the sprinkler valve unseen. Woody’s voice box line in the ambush is his own voice, not a recording; play it with a slight crackle. The rocket ride is the race finale: no time limit, just stay on the road until the fuse catches. Plush rule (0-based): mv-ts04-complete lines 5 and 6 drop without the Q12 plush. Ends the first film.

## TS5. The Yard Sale

*Toy Story 2 (Pixar, 1999): the torn arm and the yard sale* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS4, The Rocket · requires: TS4

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Andy (Andy Davis (Pixar, Toy Story 1–3)), Andy’s Mum (Andy’s mother (Pixar, Toy Story 1–3)), Wheezy (Wheezy the penguin (Pixar, Toy Story 2)), Hamm (Hamm the piggy bank (Pixar, Toy Story)), Rex (Rex the dinosaur (Pixar, Toy Story)), Slinky (Slinky Dog (Pixar, Toy Story)), Al (Al McWhiggin of Al’s Toy Barn (Pixar, Toy Story 2))

### Step 1: Climb to the high shelf and talk to Wheezy.

Hint: Bring a Nubbin that climbs well. The bookcase is dusty, so go slowly. · check: `talk:ts-wheezy`

#### Scene `mv-ts05-arm`

_Time has gone by in the new house. Andy is off to cowboy camp, and Woody has been waiting all year for it._  
_Then Andy plays rough before breakfast, and Woody’s arm tears open at the shoulder. Stuffing shows._  
**Andy** _(sad)_: Aw, no. Mum? Woody’s ripped.  
_Andy goes to camp without him. His mum puts Woody on the high shelf, which is where toys go when nobody is sure._  
**Woody** _(sad)_: It’s fine. He’ll fix me when he gets back. That’s what the shelf is for. Waiting.  
_That night Woody dreams that Andy drops him in a bin bag full of other arms and legs. He wakes up shaking._  
_Behind a book on the shelf, something squeaks very faintly. A penguin, flat and furred over with dust._  
**Wheezy** _(sad)_: Oh, hello. Sorry. Don’t get up. My squeaker went months ago, so now I just sort of… wheeze.  
**Wheezy**: Somebody was going to take me to be mended. I think they forgot. Then I forgot to remind them.  
_Your Nubbins sit either side of him. The penguin leans on one of them, very gently, as if it might break._  

#### Done `mv-ts05-arm-done`

_Outside, someone is setting up trestle tables on the lawn. Andy’s mum is pricing things with little coloured stickers._  
_She reaches up to the shelf and takes Wheezy. You watch him go out of the door in a box marked 25¢._  

### Step 2: Ride Buster through the yard sale and bring Wheezy home.

Hint: Stealth on dogback: Buster is allowed in the yard. Toys are not. · check: `expedition:complete:mv-ts-yard-sale:stealth`

#### Scene `mv-ts05-sale`

**Woody** _(shock)_: A yard sale. She’s selling him. For a quarter! He’s worth at least a dollar!  
**Woody**: Somebody whistle for Buster. I’m going out there.  
_Buster is Andy’s dog, grown up now and almost exactly the size of a sofa._  
**Hamm**: Woody, your arm is hanging by a thread. An actual thread. I can see it.  
**Woody**: Then I’ll use the other one.  
_Woody climbs onto Buster’s back. Your Nubbins climb on behind him and hold on to the collar._  
**Rex** _(shock)_: Be careful! There are people out there! There are tables! There are prices!  
_Down the stairs, out of the door, across the lawn, through a forest of grown-up legs towards the 25¢ box._  

**Choices**

- **Grab Wheezy yourself and let Woody steer the dog.** — sets `{"mv-ts-wheezy":"keeper"}`
    - You pull Wheezy out of the box by his flipper. He weighs nothing at all.
    - **Wheezy**: Oh! Hello again! Am I being stolen? How exciting.
- **Steer Buster yourself so Woody can make the grab.** — sets `{"mv-ts-wheezy":"woody"}`
    - You steer with both hands in Buster’s fur. Woody leans down and scoops Wheezy up with his good arm.
    - **Woody**: Got him! Home, Buster, home!
- **Tell Woody to stay inside. One torn arm is enough risk for one day.** — sets `{"mv-ts-wheezy":"warned"}`
    - **Woody**: If I stay up here, I’m just another toy on a shelf deciding who’s worth saving. Hold the collar.
    - He goes anyway, of course. You hold the collar, and your Nubbins hold you.

#### Done `mv-ts05-sale-done`

_Buster trots back in with Wheezy and your Nubbins. But Woody slips off halfway across the lawn and lands face-up in the grass._  
_A man in a chicken-print shirt bends down, picks Woody up, and his whole face changes._  
**Al** _(shock)_: No. No way. An original Woody, lying in the grass. At a yard sale.  

### Step 3: Chase Al’s car down the street with Buzz.

Hint: A run on toy legs against a car. You can’t win it; get close enough to read the number plate. · check: `race:finish:mv-ts-chase-al:run`

#### Scene `mv-ts05-al`

**Al**: Ma’am! What do you want for this? I’ll give you fifty. Cash. Right now.  
**Andy’s Mum** _(think)_: Sorry, that one’s my son’s. It got into the wrong box.  
**Al**: Ma’am, I collect. I will give you real money.  
**Andy’s Mum**: Then you’ll understand why it isn’t going anywhere.  
_She drops Woody in the cashbox to keep him safe, and turns away to help a woman with a lamp._  
_Al looks left, and right. He lifts Woody out of the cashbox, slips him into his bag and walks to his car._  
_From Andy’s bedroom window, Buzz sees all of it._  
**Buzz Lightyear** _(angry)_: He’s been taken. We’re going down there.  
**Slinky**: Buzz, you can’t go down there in daylight. There’s a whole yard sale!  
**Buzz Lightyear**: Watch me.  

#### Done `mv-ts05-al-done`

_The car pulls away. Buzz stops in the road, panting inside his helmet, and your Nubbins stop with him._  
_A few chicken-print feathers drift where the car was. On its number plate, in big letters: TOYBRN 1._  

#### Complete `mv-ts05-complete`

_That night the whole room watches local TV, while Buzz paces in front of the set with a crayon._  
_An advert comes on: a man in a chicken suit, flapping in front of a warehouse full of toys. It’s the man from the lawn._  
**Al** _(happy)_: If you can’t find it at Al’s Toy Barn, kids, it was never made! Bawk!  
**Hamm**: Al’s Toy Barn. Toy B-R-N. It was right there on his bumper.  
**Buzz Lightyear**: Then that’s where we go. Who’s with me?  
_Buzz, Hamm, Rex, Slinky, Mr. Potato Head and your Nubbins step forward. Wheezy gives a thin, hopeful wheeze._  
**Wheezy** _(soft)_: Bring him back. He came for me. Nobody comes for you on a shelf.  
_Before you go, Wheezy gives you the little bow tie from his own neck, for luck. He’s had no use for it lately._  

**Rewards**

- Wheezy’s Bow Tie (cosmetic): A small red bow tie from a penguin who was finally rescued. Wearable by any Nubbin.
- Yard Sale Sign (decor): A hand-lettered YARD SALE sign for the Grove. Anything Nubbins leave beside it is not for sale.

Sets on completion: `{"mv-ts05":true}`

**Notes:** Opens the second film. Woody’s nightmare is a short dim cutaway (bin bag of loose toy limbs, played eerie, not gory). Yard sale: stealth on a big dog; humans ignore Buster but notice toys riding him if Buster stops in their line of sight. The number plate “TOYBRN 1” and Al’s ad are original; the ad uses a bright jingle (original, no lyrics). Al steals Woody in plain sight of the player but the theft cannot be prevented; the race only needs to be finished. `mv-ts-wheezy` gains a third value, `warned` (added in review): the Keeper argues for caution, Woody goes anyway, and the step plays exactly as `woody`.

## TS6. Al’s Toy Barn

*Toy Story 2 (Pixar, 1999): the road crossing and Al’s Toy Barn* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS5, The Yard Sale · requires: TS5

**Cast:** Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Rex (Rex the dinosaur (Pixar, Toy Story)), Hamm (Hamm the piggy bank (Pixar, Toy Story)), Slinky (Slinky Dog (Pixar, Toy Story)), Mr. Potato Head (Mr. Potato Head (Pixar, Toy Story)), Utility Belt Buzz (The newer Buzz Lightyear with a utility belt (Pixar, Toy Story 2)), Barbie (Barbie (Mattel; as in Pixar, Toy Story 2–3)), Al (Al McWhiggin of Al’s Toy Barn (Pixar, Toy Story 2))

### Step 1: Cross the highway under the traffic cones.

Hint: A stop-and-go race. Move while the traffic moves; freeze the moment it stops. · check: `race:finish:mv-ts-traffic-cones`

#### Scene `mv-ts06-road`

_Al’s Toy Barn is across town, which is to say across the world. The rescue party walks all night._  
_By morning you reach a four-lane road. On the far side stands a giant barn sign with a chicken on it._  
**Rex** _(shock)_: Do we have to cross it? Can we go round? Is there a round?  
**Buzz Lightyear**: There’s a stack of traffic cones on the verge. Everyone under one. We cross on my word.  
**Hamm**: Under a cone. Fine. I’ve been under worse. I’ve been under Andy’s bed since spring.  
_Each of you takes a cone. Your Nubbins share one, which waddles._  
**Buzz Lightyear** _(angry)_: Move only when the cars are moving. Freeze when they stop. Ready… now!  
_Behind you, drivers start braking hard and something crunches. Something else honks for a very long time._  
**Slinky**: Don’t look back. I think we did that. Don’t look back.  

**Choices**

- **Cross in the gaps between cars, one lane at a time.** — sets `{"mv-ts-cones":"careful"}`
    - You time it gap by gap, and it takes for ever. Fewer things crunch.
    - **Buzz Lightyear**: Textbook, Keeper. Textbook.
- **Just run for it.** — sets `{"mv-ts-cones":"run"}`
    - You run. A lorry swerves round your cone and into a ditch, and a load of watermelons goes everywhere.
    - **Mr. Potato Head**: Oh, that’s on us. That is definitely on us.

#### Done `mv-ts06-road-done`

_The last cone reaches the far kerb, and behind you the road looks like a bad day at the fair. Nobody is hurt; everybody is late._  
**Buzz Lightyear**: Regroup. Let’s go and find our sheriff.  

### Step 2: Get Buzz out of the box and catch up with the rescue party.

Hint: An expedition through the Barn after closing. Pull the tape from the bottom; that flap gives first. · check: `expedition:complete:mv-ts-toy-barn`

#### Scene `mv-ts06-aisle`

_The Barn is enormous after closing time. Aisles run off into the dark like streets in a city._  
_Buzz turns a corner and stops dead. An entire aisle of Buzz Lightyears, hundreds of them, boxed and lit like a cathedral._  
**Buzz Lightyear** _(think)_: …Huh. So that’s what I look like from the outside.  
**Buzz Lightyear** _(think)_: Hundreds of me, all newer. Is this how Woody felt, the day I landed on his bed?  
_One of them isn’t in his box. He’s newer and shinier, and he wears a utility belt with a grappling hook._  
**Utility Belt Buzz** _(angry)_: Halt! Ranger, you’ve broken out of your stasis pod. Who authorised that?  
**Buzz Lightyear** _(think)_: Listen to me. You’re a toy. I’m a toy. There’s a cowboy across town who needs…  
**Utility Belt Buzz**: Your circuits are scrambled, soldier. It happens on long missions. Let’s get you back in your pod.  
_Before Buzz can finish, the new Buzz tips him into an empty box and tapes it shut. He salutes and strides off._  
_Your Nubbins are on the shelf below. They saw everything, and nobody else did._  
_Down the aisle, the rescue party waves the new Buzz over, sure he’s theirs. He goes with them, of course._  

**Choices**

- **Cut Buzz out of the box first.** — sets `{"mv-ts-aisle":"freed"}`
    - Your Nubbins chew through the tape. Buzz bursts out like a jack-in-the-box with something to prove.
    - **Buzz Lightyear**: Thank you. Now, where is that impostor taking my friends?
- **Follow the others. Buzz can get himself out.** — sets `{"mv-ts-aisle":"followed"}`
    - You go after the party. Behind you, a box rocks, and rocks, and splits down the side.
    - **Buzz Lightyear**: Fine! I’ll do it myself! I always end up doing it myself!

#### Done `mv-ts06-aisle-done`

_The rest of the party has borrowed a pink convertible from the doll aisle, with the new Buzz up front and a Barbie at the wheel._  
**Barbie** _(happy)_: Welcome to the Barn, everybody! On your left, the doll aisle, where nobody has ever had a bad hair day.  
_The new Buzz is navigating, very confidently. He is going the wrong way._  

#### Complete `mv-ts06-complete`

_Al comes out of his office, talking into a phone wedged under his chin._  
**Al** _(happy)_: The whole Roundup set. All of it. A museum in Tokyo, can you believe that? I fly tomorrow.  
_The party, wrong Buzz and all, ducks into Al’s bag as he leaves. The real Buzz and your Nubbins chase him across the car park._  
_Al crosses the street to a tall apartment block and goes up in the lift. The doors close before anyone can reach them._  
**Buzz Lightyear**: The vents. We go up through the vents. Nubbins, you’re the smallest. You’re point.  
_On a shelf by the door is a spare utility belt, still in its plastic. Buzz looks at it, and then, a little sheepishly, gives it to you._  

**Rewards**

- Utility Belt (cosmetic): A toy space-ranger utility belt with a (non-working) grappling hook. Fits any Nubbin.
- Traffic Cone (decor): An orange traffic cone for the Grove. Nubbins hide under it and waddle about.

Sets on completion: `{"mv-ts06":true}`

**Notes:** Highway crossing: road traffic and crashes are slapstick and bloodless; drivers shout off-screen and nobody is hurt (say so in the done scene). The second Buzz needs a distinct sprite (utility belt, brighter plastic) so the player can follow the swap. Barbie here is the toy-store tour-guide doll, not the TS9 Barbie; same speaker id is fine. Al’s phone call sets up TS7: the museum is Konishi’s in Tokyo, but only “a museum in Tokyo” is said.

## TS7. The Roundup Gang

*Toy Story 2 (Pixar, 1999): Al’s apartment, Jessie’s story* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS6, Al’s Toy Barn · requires: TS6

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Jessie (Jessie the Yodelling Cowgirl (Pixar, Toy Story 2–4)), Stinky Pete (Stinky Pete the Prospector (Pixar, Toy Story 2)), Al (Al McWhiggin of Al’s Toy Barn (Pixar, Toy Story 2))

### Step 1: Meet the Roundup Gang in Al’s apartment.

Hint: Come out of the heating vent while Al is out. Bullseye will find you first. · check: `talk:ts-roundup-gang`

#### Scene `mv-ts07-roundup`

_You come out of a heating vent a floor ahead of Buzz. Woody is on a glass table under a lamp, his torn arm dangling._  
_He isn’t alone. A cowgirl in a red hat sits on the table edge, and a toy horse is licking his face._  
**Woody** _(shock)_: You! Am I glad to see… how did you… never mind. Meet the Roundup Gang. Apparently I’m famous.  
**Jessie** _(happy)_: Famous? Cowboy, you’re the star! Lunchboxes! Yo-yos! A record player shaped like your hat! Bullseye, show him!  
_The horse gallops to an old television and noses the play button on a stack of tapes._  
_Black-and-white puppets and banjo music. A little marionette Woody rides across a painted desert with Jessie and Bullseye behind._  
_Your Nubbins sit in front of the screen with their mouths open. So does Woody._  
_A third toy watches from a shelf, sealed in his box: an old prospector with a pickaxe and a beard like a broom._  
**Stinky Pete** _(happy)_: Still in my box. Never opened, never played with. Fifty years and not one scratch.  
**Stinky Pete**: And now you’re here, Woody, the set’s complete. Al’s selling us to a museum in Tokyo. All of us, together, for good.  
**Woody** _(think)_: A museum. In Japan. No, see, I have a kid. I’m only here till my friends come.  
_Jessie’s face falls. She goes back into her box without another word._  

**Choices**

- **Ask for another tape. The show is actually good.** — sets `{"mv-ts-roundup":"fan"}`
    - **Stinky Pete**: A connoisseur. I knew I’d like you.
    - Bullseye hits play again, very fast, before anyone can stop him.
- **Back Woody up. He has a kid waiting.** — sets `{"mv-ts-roundup":"home"}`
    - The Prospector’s smile stays exactly where it is. His painted eyes seem to do something else.
    - **Stinky Pete**: Of course. Of course he does.

### Step 2: Hide under the cleaner’s bench and hand back whatever he drops.

Hint: Stealth: little things roll off the bench. Roll them back while his head is down. · check: `expedition:complete:mv-ts-cleaners-bench:stealth`

#### Scene `mv-ts07-arm`

_That night Woody tries to get his arm loose from Al’s tape and go. He climbs down the table leg in the dark._  
_The television switches itself on, loud static right by the sofa. Al stumbles in and finds Woody on the floor._  
**Al** _(think)_: Huh? How’d you get down there?  
_By morning Woody’s torn arm has come off in Al’s hands, and Al has locked it in a drawer._  
**Woody** _(angry)_: Somebody switched that TV on. Somebody wanted me caught.  
**Jessie** _(angry)_: Don’t look at me! I was in my box! I’m always in my box!  
_The Prospector, sealed in his own box, says nothing at all. He’s good at that._  
_Then the door opens on an old man with a case of tiny brushes, glues and tools. Al calls him the cleaner._  
_He sits Woody under the lamp and works for hours. New stitches at the shoulder, fresh paint on the boots, and even the hat gets brushed._  

#### Done `mv-ts07-arm-done`

_When he’s finished, Woody’s arm is better than the day he was made. The old man pats him once on the head and goes._  
**Woody** _(soft)_: …I can’t even feel the seam.  

### Step 3: Help Woody choose: the museum for ever, or Andy for now.

Hint: Listen to everyone. Your answer changes what Woody says, not where he ends up. · check: `talk:ts-woody:after-emily`

#### Scene `mv-ts07-emily`

_Woody stands at the vent, ready to go home. Jessie sits on the windowsill and won’t look at him._  
**Jessie** _(angry)_: Go on, then. Go back to your kid. He’ll love you right up until he doesn’t.  
**Woody** _(angry)_: Andy’s not like that.  
**Jessie** _(sad)_: Mine wasn’t either. Her name was Emily.  
_Jessie tells it: Emily took her everywhere, to the creek, in the car, under the covers with a torch. They were best friends for years._  
_Then Emily grew up: make-up on the dresser, records, a phone with a long curly cord. Jessie went under the bed._  
**Jessie** _(sad)_: One day she found me again. I thought, this is it. She remembered me.  
**Jessie** _(sad)_: She drove me out to a charity box by the road, and put me in it, and drove away.  
_Somewhere in the apartment a radio is playing something soft. Nobody turns it off._  
**Stinky Pete** _(soft)_: That’s what children do, Woody. A museum doesn’t grow up.  
**Woody** _(think)_: …For ever. Behind glass. Nobody ever leaves you behind glass.  
_Woody steps back from the vent and sits down by Jessie. Just then the vent cover rattles, and Buzz climbs out._  

**Choices**

- **Tell Woody that Andy needs him now, not later.** — sets `{"mv-ts-choice":"andy"}`
    - **You**: He hasn’t grown up yet, Woody. You’d miss all of it.
    - **Buzz Lightyear**: Listen to them. You taught me this, cowboy. A toy is for a kid, not a glass case.
- **Tell Woody not to leave Jessie behind either.** — sets `{"mv-ts-choice":"together"}`
    - **You**: Then don’t leave her by another road. Bring them.
    - **Woody**: …Bring them. To Andy’s. Why didn’t I think of that?
- **Tell Woody it’s his choice, and you’ll respect it.** — sets `{"mv-ts-choice":"his"}`
    - **Woody**: Some help you are.
    - But he looks at the TV, at the little puppet of himself waving to a crowd of children, and something in his face changes.

#### Done `mv-ts07-emily-done`

**Woody** _(happy)_: No. I’m going home. And you’re coming with me, all three of you. There’s room in Andy’s room.  
**Jessie** _(shock)_: …You mean it? A kid? A real kid?  
_Bullseye spins in a joyful circle. Jessie starts to laugh._  

#### Complete `mv-ts07-complete`

_Then a clang. The vent cover slams shut, and a screwdriver turns its screws from the inside._  
_The Prospector is out of his box. He stands on the television with the screwdriver in his hand._  
**Stinky Pete** _(angry)_: Fifty years on a shelf. I watched every other toy in that shop get taken home. Every one.  
**Stinky Pete** _(angry)_: No child ever chose me. I don’t intend to give one the chance now. Nobody leaves.  
**Woody** _(shock)_: It was you. The TV. You let Jessie take the blame.  
_In all the noise, the cleaner’s spare touch-up kit is still under the table, where your Nubbins hid it. It comes with you._  

**Rewards**

- Cleaner’s Touch-Up Kit (item): Tiny brushes and paint from Al’s restorer. Use it to restore a faded or scuffed cosmetic to new.
- Roundup Regular (title): Keeper title for watching the whole Roundup tape collection. Bullseye insisted.

Sets on completion: `{"mv-ts07":true}`

**Notes:** The Roundup show is a black-and-white puppet show with original banjo music; no theme song lyrics. Jessie’s story about Emily is the line’s first quiet scene: play it as a montage behind her lines, warm colours that fade to grey, with soft original instrumental music (the radio). No lyrics. The cleaner never speaks; keep him gentle and wordless. The museum in Tokyo is named only as such. `mv-ts-choice` changes only the then-lines; Woody always chooses Andy and invites the Gang.

## TS8. The Airport

*Toy Story 2 (Pixar, 1999): the airport and the runway* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS7, The Roundup Gang · requires: TS7

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Hamm (Hamm the piggy bank (Pixar, Toy Story)), Rex (Rex the dinosaur (Pixar, Toy Story)), The Aliens (The three-eyed claw-machine aliens (Pixar, Toy Story)), Stinky Pete (Stinky Pete the Prospector (Pixar, Toy Story 2)), Jessie (Jessie the Yodelling Cowgirl (Pixar, Toy Story 2–4)), Andy (Andy Davis (Pixar, Toy Story 1–3)), Plush Nubbin (The plush Nubbin from fun quest Q12, Just Resting (original))

### Step 1: Drive the Pizza Planet truck to the airport before Al checks in.

Hint: A race with a whole crew on the pedals. Watch the brake, and don’t let Rex look at the speedometer. · check: `race:win:mv-ts-airport-run`

#### Scene `mv-ts08-truck`

_Al packs the Roundup Gang into a case with foam cut-outs and leaves for the airport. The Prospector rides along, pleased with himself._  
_Buzz and the rescue party get out of the vents and reach the street with your Nubbins. Al’s car is already turning the corner._  
**Buzz Lightyear**: We need a vehicle. Big. Fast. Anybody?  
_At the kerb sits a Pizza Planet delivery truck, engine warm, keys in. Hamm whistles._  
_Buzz steers. Rex has the accelerator, Slinky the brake, Mr. Potato Head the indicators, and your Nubbins the horn._  
**Hamm**: Left at the lights. No, the other left. The left everybody else uses.  
**Rex** _(shock)_: I can’t see where I’m going! I’ve only got little arms!  
**Buzz Lightyear** _(angry)_: Faster, Rex. If Al gets on that plane, they go to Tokyo in a box.  
**The Aliens** _(happy)_: The great wheel turns. We are going somewhere. Somewhere is glorious.  

**Choices**

- **Take the shortcut through the car park.** — sets `{"mv-ts-truck":"shortcut"}`
    - Over a kerb, under a barrier, past a man with a trolley who will be telling this story for years.
    - **Hamm**: That counts as legal. I think.
- **Stay on the road. Nobody gets hurt.** — sets `{"mv-ts-truck":"road"}`
    - You keep to the road and, mostly, the speed limit. Rex indicates at every single turn.
    - **Buzz Lightyear**: Slower. But nobody ends up in a ditch of watermelons. Again.

#### Done `mv-ts08-truck-done`

_You reach the airport as Al hands his case across a counter. It slides onto a belt and disappears through a rubber curtain._  
**Buzz Lightyear**: Then we follow the case.  

### Step 2: Stop the Prospector on the baggage belt.

Hint: A karate bout on a moving belt. Keep your footing; he hits hard but slowly. · check: `karate:win:mv-ts-prospector`

#### Scene `mv-ts08-bags`

_Behind the curtain is a maze. Belts, chutes and ramps, climbing and dropping in every direction, and thousands of bags._  
_The team rides a suitcase in. Your Nubbins ride a duffel bag that is going somewhere else entirely, and have to jump._  
_At last, a green case with Al’s name on the tag. Buzz opens it: Woody is inside, and so is the Prospector, out of his box._  
**Stinky Pete** _(angry)_: You think you can go back? You’ll end up in a bin when he’s bored. Like her. Like all of them.  
_He swings his pickaxe and catches Woody’s new shoulder seam. Then he drags Woody back towards the case._  
**Woody** _(angry)_: Let go of me!  
**Buzz Lightyear** _(angry)_: You’ve had fifty years in a box to get angry, Pete. You’re not taking it out on him.  
_Buzz and the gang haul the Prospector out onto the belt. Your Nubbins block the end, where the chute drops._  

**Choices**

- **Tell the Prospector it isn’t too late. A kid might still choose him.** — sets `{"mv-ts-pete":"mercy"}`
    - **You**: Fifty years is a long time, Pete. It isn’t for ever. Somebody might still pick you.
    - **Stinky Pete**: Somebody. Somebody would have, by now.
    - But for half a second, the hand on the pickaxe goes slack.
- **Tell him he doesn’t get to choose for ever on anyone else’s behalf.** — sets `{"mv-ts-pete":"firm"}`
    - **You**: You want a glass case, fine. You don’t get to put Jessie in one. Or Woody.
    - **Stinky Pete**: Somebody has to decide for them. Children certainly won’t.

#### Done `mv-ts08-bags-done`

_The Prospector ends up in a little girl’s backpack, the kind with crayons and glitter in every pocket._  
_She takes one look at him and decides, out loud, that his face needs a lot more colour. He screams, silently, as toys must._  
**Stinky Pete** _(shock)_: I was in mint condition! Mint!  
_After fifty years, a child has picked him. It is not going the way he pictured it, and it is not the worst thing either._  

### Step 3: Keep pace with the plane’s wheels until Woody and Jessie can drop.

Hint: A sprint under a moving plane. Stay right of the wheels and level with Bullseye’s saddle. · check: `race:finish:mv-ts-runway:run`

#### Scene `mv-ts08-plane`

_Jessie is still in the case, and the case is gone. It’s on a baggage cart heading out to the plane._  
_Woody and Buzz ride Bullseye out across the tarmac. Your Nubbins cling to his tail._  
_The bags go in and the hold door shuts. Woody climbs in through the landing-gear well and finds Jessie behind a crate._  
**Jessie** _(shock)_: Woody! It’s locked, I can’t get out, it’s…  
**Woody** _(soft)_: Come on. Hold my hand. Don’t let go of it, whatever happens.  
_The plane starts to roll. They climb down into the wheel bay, and the runway blurs by below them._  
**Jessie** _(shock)_: There’s nowhere to go!  
_Woody hooks his pull-string over a bolt in the wheel bay. It’s long enough, just._  
**Woody**: Jessie. Trust me.  
_Down on the runway, Buzz kicks Bullseye on. Your Nubbins run beside the horse as fast as stitched legs go._  

#### Done `mv-ts08-plane-done`

_They swing, let go, and land square in Bullseye’s saddle. The plane lifts off without them and shrinks to a dot._  
**Jessie** _(happy)_: …Can we do that again?  
**Buzz Lightyear** _(happy)_: Not today, ma’am.  

#### Complete `mv-ts08-complete`

_Andy comes home from camp to find Woody on his bed with a cowgirl, a horse and a penguin who can squeak again._  
**Andy** _(happy)_: Whoa. Where did these come from? Mum! Did you get me these?  
_That night Andy mends Woody’s shoulder with thick black thread. It isn’t pretty, but Woody thinks it’s the best stitching he ever had._  
**Woody** _(soft)_: He’ll grow up, Buzz. I know it. Jessie knows it. One day he won’t need us.  
**Buzz Lightyear** _(think)_: And until then?  
**Woody** _(happy)_: Until then I’ve got a job. And you’re going to help me do it.  
**Jessie** _(soft)_: And when he grows up, we’ll have had him. That’s more than a glass case ever gave anybody.  
_Your plush Nubbin makes room in the toy box for two more. It has got good at that._  
_Jessie gives you a coil of rope tied as a lasso, and Bullseye gives you a lick. Both are, apparently, gifts._  

**Rewards**

- Roundup Lasso (cosmetic): A coil of rope tied by Jessie. Nubbins wear it over one shoulder and occasionally lasso fruit.
- Bullseye Rocking Horse (decor): A rocking horse for the Grove in Bullseye’s colours. It sometimes rocks on its own when Nubbins are happy.

Sets on completion: `{"mv-ts08":true}`

**Notes:** Ends the second film. The Prospector’s fate is comic, not cruel: the girl is excited, not mean; cut on his silent scream. The baggage maze is an expedition-style backdrop for the karate bout (the arena scrolls). Runway: night, plane lights, engine roar ducked under music; the race just needs finishing. Plush rule (0-based): mv-ts08-complete line 7 drops without the Q12 plush. `mv-ts-pete` (mercy/firm, added in review) only changes the then-lines; the backpack girl is the same either way, and the last done line lands as irony or as hope depending on it. The aliens rode along in the truck since TS2 (they are Mr. Potato Head’s adopted sons in the source; nothing needs saying).

## TS9. Sunnyside

*Toy Story 3 (Pixar, 2010): college, the donation and Sunnyside Daycare* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS8, The Airport · requires: TS8

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Hamm (Hamm the piggy bank (Pixar, Toy Story)), Jessie (Jessie the Yodelling Cowgirl (Pixar, Toy Story 2–4)), Andy’s Mum (Andy’s mother (Pixar, Toy Story 1–3)), Lotso (Lots-o’-Huggin’ Bear (Pixar, Toy Story 3)), Ken (Ken (Mattel; as in Pixar, Toy Story 3)), Mrs. Potato Head (Mrs. Potato Head (Pixar, Toy Story 2–3)), Chatter Telephone (Chatter Telephone (Pixar, Toy Story 3)), Barbie (Barbie (Mattel; as in Pixar, Toy Story 2–3)), Rex (Rex the dinosaur (Pixar, Toy Story)), Plush Nubbin (The plush Nubbin from fun quest Q12, Just Resting (original))

### Step 1: Get every toy out of the bin bag before the bin lorry arrives.

Hint: A short expedition: tear, crawl, hide under the recycling crate. Count heads before you move. · check: `expedition:complete:mv-ts-curbside`

#### Scene `mv-ts09-college`

_Years go by in a few heartbeats. Andy is seventeen, with a car, a phone, a deeper voice and a room full of boxes._  
_Nobody has played with the toys in a long time, and Bo was given away years ago. The army men parachuted out of the window one night, saluting._  
**Woody** _(think)_: Andy leaves for college in three days. Worst case, it’s the attic. The attic has rafters. Character. Each other.  
**Hamm**: The attic. Where toys go to look at a ceiling for twenty years.  
**Jessie** _(sad)_: We know how this ends, Woody. Some of us have done it before.  
_Andy comes in with a bin bag and a cardboard box. Into the box goes Woody, the one he’s taking; into the bag go all the rest._  
_Your Nubbins go into the bag, and so do you._  
_Your plush Nubbin is already at the bottom, between Rex’s tail and Hamm._  
_Andy leaves the bag on the landing for the attic. His mum, tidying, finds a black bag on the landing._  
**Andy’s Mum** _(happy)_: Oh, good, he’s cleared out the rubbish.  
_She carries it out to the kerb. The bin lorry is three doors down._  

**Choices**

- **Tear the bag open from the inside.** — sets `{"mv-ts-curb":"tore"}`
    - Your Nubbins chew and Rex pushes. A hole opens just as the bin lorry’s brakes hiss next door.
- **Stay calm. Andy will come and find you.** — sets `{"mv-ts-curb":"waited"}`
    - **Jessie**: Nobody comes. Trust me. Nobody comes.
    - She starts tearing the plastic with her bare hands, and you help.

#### Done `mv-ts09-college-done`

_You get out under a recycling crate as the lorry stops. In the garage, a box sits in the back of the car, marked SUNNYSIDE: DONATE._  
**Jessie** _(angry)_: He put us out with the rubbish. Like wrappers.  
_One by one the toys climb into the donation box. Woody comes down the drive shouting, too late, and climbs in after them._  

### Step 2: Survive playtime in the Caterpillar Room.

Hint: A survival bout against toddlers. Stay soft, roll with it, and protect Rex’s tail. · check: `karate:survive:mv-ts-caterpillar-room`

#### Scene `mv-ts09-sunnyside`

_Sunnyside Daycare is bright and warm, with rainbows on the windows and a sandpit that smells of crayons._  
_When the children have gone home, the toys come out to greet you. At the front, leaning on a cane, comes a big pink bear._  
**Lotso** _(happy)_: Well, look at y’all! New friends! Welcome to Sunnyside. Name’s Lotso. Strawberry-scented, and it don’t wash out.  
_He smells of strawberries, all of him. It’s strong enough to make your Nubbins sneeze._  
**Lotso** _(soft)_: Here there’s no one child to let you down. New kids come in every morning, fresh as bread. Nobody ever outgrows you.  
_A doll in a perfect shirt sees Barbie and drops his clipboard. It is love, and it is immediate._  
**Ken** _(shock)_: Ken. Hi. I have a… I have a house. It has a lift. Do you like… cravats?  
**Woody** _(angry)_: This is nice. It’s very nice. But we have a kid. Andy meant us for the attic, not the kerb. I saw him.  
**Jessie** _(angry)_: Andy put us out with the rubbish, Woody. Go to college. We’re staying.  
_Woody looks at you, the only one left who hasn’t picked a side._  

**Choices**

- **Stay. Somebody who loves Woody should look after the gang.** — sets `{"mv-ts-sunnyside":"stayed"}`
    - **Woody**: …Yeah. Yeah, that’s fair. Look after them. Especially Rex. And don’t let anybody near Hamm’s slot.
- **Back Woody: Andy meant the attic, and you saw it too.** — sets `{"mv-ts-sunnyside":"argued"}`
    - **You**: He’s right, Jessie. I was in that bag. Andy was carrying us up to the attic, not out to the kerb.
    - **Jessie**: Then explain why we were on the kerb. Go on. I’m listening.
    - You can’t. Not yet. You stay, because the gang is staying, and somebody has to be here when the truth comes out.

#### Done `mv-ts09-sunnyside-done`

_Woody goes over the wall alone. The rest of you are carried to the Caterpillar Room, where the toddlers are._  
_The toddlers paint Rex and chew Slinky. They bury Buzz in a sand bucket and try to post Hamm through a slot._  
_It ends at last. Your Nubbins lie flat on the carpet, damp and gluey, staring at the ceiling._  
**Buzz Lightyear** _(angry)_: This is not what we were promised. I’m going to have a word with that bear.  

### Step 3: Pick your part in Woody’s break-out plan.

Hint: Every job gets done; yours is the one you’ll play in the next storyline. · check: `talk:ts-woody:break-out-plan`

#### Scene `mv-ts09-plan`

_Buzz goes to find Lotso and is gone an hour. When he comes back, he’s different._  
**Buzz Lightyear** _(angry)_: Prisoners will remain in their cubbies. Lights out at eight.  
_Lotso’s gang found the switch in Buzz’s back and set him to demo mode. He doesn’t know you._  
_Mrs. Potato Head has a spare eye still lying in Andy’s room. Through it she can see Andy searching the attic for them._  
**Mrs. Potato Head** _(sad)_: He’s looking for us. He meant the attic all along. Oh, Andy, I’m sorry.  
_That night Woody comes back over the wall. A girl called Bonnie took him home, and one of her toys told him the truth about Lotso._  
**Woody** _(sad)_: Lotso had a kid once. Daisy. She lost him on a trip, and by the time he walked home, she’d bought another Lotso.  
**Woody**: So he decided every toy gets replaced. He runs this place like a prison. He always has.  
**Jessie** _(sad)_: Woody. I’m sorry. Get us out of here.  

**Choices**

- **Take on the cymbal monkey watching the cameras.** — sets `{"mv-ts-break":"monkey"}`
    - **Woody**: That monkey sees everything. You and Slinky take him. Quietly.
- **Get Buzz back. Find his switch.** — sets `{"mv-ts-break":"buzz"}`
    - **Jessie**: I’ll help. I want to see his face when he remembers who I am.
- **Get the manual for Buzz out of Ken.** — sets `{"mv-ts-break":"ken"}`
    - **Barbie**: Leave Ken to me. He’d trade his whole wardrobe to keep it. He’ll talk.

#### Done `mv-ts09-plan-done`

**Woody**: Tonight, then. Over the playground, down the rubbish chute and out.  
_A plastic phone on wheels rolls up under the door and rings once, very quietly._  
**Chatter Telephone** _(think)_: Getting out? Then listen. They’ve added things: bolts, guards, the monkey. You’ll need the way they don’t watch.  

#### Complete `mv-ts09-complete`

_Night falls on Sunnyside. The toys sit in a circle on the Caterpillar Room floor, whispering who does what._  
**Rex** _(sad)_: What if it goes wrong?  
**Woody** _(soft)_: Then it goes wrong together. That’s all I’ve got, Rex. Together.  
_Your plush Nubbin sits in the circle too, with a crayon smear across its face like war paint._  
_Barbie comes back from Ken’s dream house with a bag of his clothes and a mysterious smile. She hands you a cravat._  
**Barbie** _(happy)_: He has forty-two of them. He’ll notice. He’ll be devastated. Good.  

**Rewards**

- Ken’s Cravat (cosmetic): A silk cravat from the forty-two in Ken’s wardrobe. Any Nubbin wears it well.
- Caterpillar Room Survivor (title): Title for each Nubbin that lived through toddler playtime at Sunnyside.

Sets on completion: `{"mv-ts09":true}`

**Notes:** Opens the third film. Time skip: show Andy’s room aged up (posters, laptop) and the toys dustier. Woody’s visit to Bonnie’s house happens off-screen between steps 2 and 3; he reports it. Lotso is warm and grandfatherly until the plan scene; give him a slow, friendly drawl and a strawberry-pink particle when he talks. The toddlers are a cheerful, chaotic hazard, never sinister. `mv-ts-break` picks which mini-objective the player runs in TS10 step 1. `mv-ts-sunnyside` (stayed/argued, added in review) is the Keeper’s side in the Woody–Jessie split; either way the Keeper stays at Sunnyside. Plush rule (0-based): mv-ts09-college line 7 and mv-ts09-complete line 3 drop without the Q12 plush.

## TS10. The Incinerator

*Toy Story 3 (Pixar, 2010): the break-out, the landfill and the furnace* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS9, Sunnyside · requires: TS9

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Jessie (Jessie the Yodelling Cowgirl (Pixar, Toy Story 2–4)), Lotso (Lots-o’-Huggin’ Bear (Pixar, Toy Story 3)), Rex (Rex the dinosaur (Pixar, Toy Story)), The Aliens (The three-eyed claw-machine aliens (Pixar, Toy Story)), Mr. Potato Head (Mr. Potato Head (Pixar, Toy Story))

### Step 1: Break out of Sunnyside past Lotso’s guards.

Hint: Stealth. The monkey’s screens go dark once Woody and Slinky are in; move then, not before. · check: `expedition:complete:mv-ts-sunnyside-breakout:stealth`

#### Scene `mv-ts10-break`

_The break-out starts at midnight. Woody and Slinky slip into the office, where the cymbal monkey watches the screens._  
_Barbie keeps Ken busy. Buzz gets his switch flipped back, but too far, and wakes up a hero who speaks only Spanish._  
**Buzz Lightyear** _(happy)_: ¡Señorita! ¿Está usted bien? ¡Nadie le hará daño mientras yo esté aquí!  
**Jessie** _(happy)_: …I don’t know what he’s saying. But I like the way he’s saying it.  
_Over the playground, down the rubbish chute, into the big dumpster in the yard. Lotso and his gang are waiting on the lid._  
**Lotso** _(angry)_: Leaving? After everything I gave you? Room, board, children, for ever?  
**Woody** _(angry)_: Daisy didn’t replace you because she stopped loving you. She lost you. That’s different.  
**Lotso** _(angry)_: Replaced is replaced. There’s nothing different about it.  
_Big Baby, Lotso’s huge, silent enforcer, looks at Lotso for a long time. Then he lifts him and drops him into the dumpster._  
_A bin lorry’s lights sweep the yard. As the dumpster tips, Lotso grabs Woody’s leg, and everyone goes in._  

**Choices**

- **Grab Woody’s hand as he goes over.** — sets `{"mv-ts-dumpster":"grabbed"}`
    - You catch him, which only means you go into the lorry with him. You don’t let go.
- **Throw your Nubbins clear, then jump in after Woody.** — sets `{"mv-ts-dumpster":"nubbins-clear"}`
    - You throw them clear. They climb straight back in after you, of course.

#### Done `mv-ts10-break-done`

_The lorry’s compactor crunches down. Something heavy lands on Buzz, and when he sits up he speaks English again and knows everyone._  
**Buzz Lightyear** _(think)_: Why am I covered in coffee grounds? And why is Jessie holding my hand?  
**Jessie** _(happy)_: Don’t worry about it, Space Ranger.  

### Step 2: Cross the landfill with the others.

Hint: A race where stuffing helps: the big magnet can’t lift your Nubbins, so let them lead the line. · check: `race:finish:mv-ts-landfill`

#### Scene `mv-ts10-landfill`

_Dawn at the landfill. Gulls overhead, a smell like every bin in the world, and machines the size of houses grinding the heaps._  
_The toys cross the dump in a line, holding on to each other. Lotso limps along behind, as if he were one of them._  
_A shredder. Then a giant magnet that snatches everything metal, Buzz included, and Woody, holding on to Buzz._  
_Your Nubbins have no metal in them anywhere. For once, being made of stuffing is a superpower._  
_Then everyone tips down a chute onto a long conveyor belt, moving towards a bright orange glow._  
_Beside the belt there is a ladder, and at the top of the ladder a big red emergency stop button._  
**Lotso** _(shock)_: Help me up! Help me, and I’ll stop it! I swear it on my stitching!  
_Woody and Buzz boost him up the ladder. He reaches the button, and stops, and looks down at them._  
**Lotso** _(angry)_: You lot believe in kids. Let’s see your kids save you now.  
_He runs. The belt keeps moving, and everything keeps moving._  

#### Done `mv-ts10-landfill-done`

_There’s no way off the belt. Every toy tries anyway: scrabbling, climbing, sliding back._  

### Step 3: Hold on to them.

Hint: Hold the button and don’t let go. Nothing else you press will help. · check: `hold:mv-ts-hands`

#### Scene `mv-ts10-furnace`

_The belt drops you into a wide pit. At the bottom the furnace door is open, and inside there is nothing but fire._  
_The toys scramble up the slope of rubbish, and it slides, and they slide. Every handhold comes away._  
**Rex** _(shock)_: Buzz? Buzz, what do we do?  
_Buzz looks at the fire. Then he looks at Jessie, and holds out his hand._  
_Jessie takes it, and Slinky takes hers. Hamm takes Slinky’s paw, Rex takes Hamm, and the Potato Heads take each other._  
_Woody is the last one still climbing. He looks up at the light at the top of the pit, and then back down at them._  
_He takes Buzz’s hand._  
_Your Nubbins are beside you, and they take your fingers, one on each side._  
_Your plush Nubbin takes Woody’s other hand._  
_Nobody says anything. There is nothing left to say._  
_The heat grows. The light turns everything white._  

#### Done `mv-ts10-furnace-done`

_A shadow falls across the pit. A great metal claw comes down out of the sky and closes round all of you at once._  
_It lifts you up out of the fire, over the edge, into cold grey morning air. You still haven’t let go of anyone._  
_In the crane cab, three little green aliens are pulling the levers together, all nine eyes shining._  
**The Aliens** _(happy)_: We have come. Today, we are the hand.  

#### Complete `mv-ts10-complete`

_The claw sets you down on the edge of the landfill, gently, the way it sets down prizes._  
**The Aliens** _(soft)_: You took us from the machine, long ago. Now we take you. The debt is clean.  
**Mr. Potato Head** _(happy)_: My boys. My little boys. Who taught you to drive a crane?  
_Nobody can stop shaking. Jessie still has Buzz’s hand, and she doesn’t give it back._  
_Woody lets go of your plush Nubbin last, one stitched finger at a time._  
**Woody** _(soft)_: Okay. Okay. Let’s go home.  
_Far behind you, a bin lorry driver finds a pink bear and ties him to the front grille with his other finds. He won’t be getting down._  
_Your Nubbins don’t let go of your hands for the rest of the day. You don’t ask them to._  

**Rewards**

- Held On (title): Title for each Nubbin that held your hand at the furnace. It never comes off the stat sheet.
- Little Green Claw (decor): A toy crane the aliens built from landfill scraps. Nubbins use it to lift each other gently onto high places.

Sets on completion: `{"mv-ts10":true}`

**Notes:** The line’s hardest scene; play the furnace completely straight. Staging for mv-ts10-furnace: no music from line 3 (Buzz holding out his hand, 0-based) onward, only furnace roar, slowly rising. Each “takes a hand” line shows the hands joining in close-up. The step check `hold:mv-ts-hands` is a single held input: the player holds the button and keeps holding through the remaining lines and the white-out (about 8 seconds); mashing or the struggle inputs from the previous step do nothing at all. If the player lets go, the Nubbin portraits simply reach for the Keeper again and the hold restarts. No fail state. The white-out cuts straight to the claw’s shadow. Plush rule (0-based): mv-ts10-furnace line 8 and mv-ts10-complete line 4 drop without the Q12 plush. Lotso’s fate is told, not shown. Buzz’s Spanish lines are original; have them checked by a Spanish speaker.

## TS11. Bonnie

*Toy Story 3 (Pixar, 2010): the note and the hand-over* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS10, The Incinerator · requires: TS10

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Buzz Lightyear (Buzz Lightyear (Pixar, Toy Story 1–4)), Andy (Andy Davis (Pixar, Toy Story 1–3)), Andy’s Mum (Andy’s mother (Pixar, Toy Story 1–3)), Bonnie (Bonnie Anderson (Pixar, Toy Story 3–4)), Plush Nubbin (The plush Nubbin from fun quest Q12, Just Resting (original))

### Step 1: Get the toys and Woody’s note into the attic box before Andy comes back upstairs.

Hint: A short stealth run across the landing. Andy’s mum is in the doorway, so go round behind the laundry basket. · check: `expedition:complete:mv-ts-attic-box:stealth`

#### Scene `mv-ts11-note`

_A bin lorry brings you home. The driver doesn’t notice a few extra toys on his back step, and the toys don’t mention it._  
_College day, and the car is nearly packed. Andy’s mum stands in his empty bedroom and can’t quite make herself leave it._  
**Andy’s Mum** _(sad)_: It’s so quiet in here already. How is it already quiet?  
**Andy** _(soft)_: Mum. It’s college. It’s not the moon.  
_Woody is in the college box; the others are in the attic box beside it. Woody looks from one to the other for a long time._  
**Woody** _(think)_: He wants to take me. He does. And I’ll sit on a shelf in a dorm and watch him have a whole life.  
**Woody**: Or…  
_He takes a pen and a sticky note from Andy’s desk, writes an address, and sticks it on the attic box. Bonnie’s address._  

**Choices**

- **Tell Woody to go with Andy. He earned it.** — sets `{"mv-ts-note":"go"}`
    - **Woody**: I did. Didn’t I. I earned it.
    - He looks at the box with the others in it. He doesn’t take his hand off the note.
- **Tell Woody his place is with the others.** — sets `{"mv-ts-note":"together"}`
    - **Woody**: Yeah. I think so too. I just needed somebody to say it.
- **Say nothing. Hold his hand.** — sets `{"mv-ts-note":"held"}`
    - You take his hand, the way you did over the fire. He squeezes once.

#### Done `mv-ts11-note-done`

_Andy comes up the stairs, sees the note and frowns. He doesn’t remember writing it, but it’s exactly his kind of idea._  
**Andy** _(think)_: Huh. Yeah. Okay. Yeah.  

### Step 2: Stay perfectly still while Andy hands you over.

Hint: Humans are watching the whole time. Hold still, even when it’s hard. · check: `freeze:mv-ts-handover`

#### Scene `mv-ts11-bonnie`

_Andy drives across town to a small house with a porch. A little girl in the front yard is talking to a stuffed unicorn._  
**Andy** _(soft)_: Hi. Are you Bonnie? I’ve got some toys. They need somebody who’ll really play with them.  
_He takes them out of the box one at a time, and says something about each._  
**Andy**: This is Jessie. Bravest cowgirl going. She hates being shut in boxes, so don’t.  
**Andy**: This is Rex. Most terrifying dinosaur ever made. Don’t tell him, but he isn’t terrifying at all.  
**Andy**: These guys just turned up one day. I never figured out where from. They’re soft. They’re good.  
_That’s your Nubbins. Bonnie takes them both at once and hugs them hard enough to squeak._  
**Andy** _(soft)_: And this plush one never moves. Ever. But I always kind of thought it was listening.  
_At the bottom of the box, Andy finds Woody, who isn’t supposed to be there. He picks him up and goes completely still._  
**Bonnie** _(happy)_: That’s the sheriff! The sheriff from my bag!  
_She reaches for him, and Andy pulls his hand back, just an inch. Then he kneels down and holds Woody out to her._  

### Step 3: Play with Andy and Bonnie one last time.

Hint: Free play. There is no score. Play until the sun goes down. · check: `play:mv-ts-last-afternoon`

#### Scene `mv-ts11-play`

**Andy** _(soft)_: He’s Woody. He’s been mine since before I could say his name. I used to call him Wuh.  
**Andy** _(soft)_: He looks after everybody. Doesn’t matter what happens, he’s there. So you have to look after him back. Okay?  
**Bonnie** _(soft)_: Okay. I promise.  
_And then, instead of driving off, Andy sits down on the grass. Bonnie looks at him, and he looks at the toys._  
**Andy** _(happy)_: …Okay. Show me how you play cowboys.  
_So they play, all afternoon: a bank robbery, a runaway train, a dinosaur rampage, a mission to space, a rodeo._  
_Your Nubbins are the townsfolk, then the aliens, then the gold in the bank. Andy flies Buzz over the porch, and Bonnie makes Woody save everyone._  
_Andy laughs like he hasn’t in years. Woody, flying through the air in Andy’s hand, can’t laugh back, though he wants to more than anything._  
_The sun goes orange, and Bonnie’s mum calls her in for dinner. Andy gets up and brushes the grass off his jeans._  

#### Done `mv-ts11-play-done`

_Bonnie picks Woody up and waves his arm at Andy. Andy waves back, and walks to his car._  

#### Complete `mv-ts11-complete`

_Andy sits in the car for a moment with both hands on the wheel, looking at the porch._  
_Then he drives away. Down the street, round the corner, gone._  
_Bonnie goes in for dinner and leaves the toys on the porch step in a row, the way children do._  
_When the door shuts, Woody sits up. He watches the corner where the car went, and doesn’t say anything for a long time._  
**Woody** _(soft)_: …Look after yourself, kid.  
_Buzz puts a hand on his shoulder, and Jessie leans on his other side._  
_Your plush Nubbin climbs into his lap and stays there._  
_Nobody tells Woody it will be all right. They just sit on the step with him until the streetlights come on._  
_In the morning Bonnie draws all her new toys, your Nubbins included, and gives you the picture. Everybody is labelled wrong, and it is perfect._  

**Rewards**

- Bonnie’s Drawing (decor): A crayon drawing of Bonnie’s new toys, your Nubbins included, every name wrong. Hangs on any Grove wall.
- Passed On (title): Keeper title for the afternoon on Bonnie’s lawn. Shown on the Keeper card.

Sets on completion: `{"mv-ts11":true}`

**Notes:** The line’s second devastating scene; play it gently and let it breathe. `freeze:mv-ts-handover` is a stillness check: the player must not move or press anything while Andy hands each toy over (about 30 seconds of lines); any input makes the Keeper twitch and the line repeats, no fail state. `play:mv-ts-last-afternoon` is free play in Bonnie’s yard with toy props (bank, train, rodeo barrel); it ends when the sun sets (about 90 seconds) whatever the player does. Andy’s car leaving: hold on the empty corner for 3 seconds before Woody’s line. The plush Nubbin stays in Bonnie’s room from here on (E5 relies on it). Plush rule (0-based): mv-ts11-bonnie line 7 and mv-ts11-complete line 6 drop without the Q12 plush. Ends the third film.

## TS12. Forky

*Toy Story 4 (Pixar, 2019): Forky, the road trip, the antique store and Bo Peep* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After TS11, Bonnie · requires: TS11

**Cast:** Woody (Sheriff Woody (Pixar, Toy Story 1–4)), Dolly (Dolly, the rag doll in Bonnie’s room (Pixar, Toy Story 3–4)), Forky (Forky (Pixar, Toy Story 4)), Gabby Gabby (Gabby Gabby (Pixar, Toy Story 4)), Bo Peep (Bo Peep (Pixar, Toy Story 1, 2 and 4)), Giggle McDimples (Giggle McDimples (Pixar, Toy Story 4))

### Step 1: Keep Forky out of the bin until morning.

Hint: An escort game. He heads for anything with a lid; your fastest Nubbin intercepts. · check: `escort:mv-ts-forky:no-bin`

#### Scene `mv-ts12-forky`

_Bonnie’s room, a year later. At playtime Bonnie unpins the star from Woody’s vest and pins it on Jessie. Sheriff Jessie rides out._  
_Woody spends the afternoon in the closet with the other left-out toys. One of them has started a calendar._  
**Woody** _(sad)_: It’s fine. It’s good. Jessie looks great in it. She does. It’s the right size and everything.  
**Dolly** _(think)_: Woody, I know how Andy’s room worked, but this isn’t Andy’s room. Bonnie does things her own way.  
_Kindergarten orientation day. Bonnie is scared to go, so Woody sneaks into her backpack to watch over her._  
_Alone at her table, Bonnie makes a friend out of the bin: a plastic spork, pipe-cleaner arms, googly eyes and lolly-stick feet. She writes her name on the feet._  
_That night, in Bonnie’s room, the spork sits up._  
**Forky** _(shock)_: Hello. Hi. What am I? Why am I? Where is the bin?  
**Woody** _(happy)_: You’re a toy. Bonnie made you. She loves you.  
**Forky** _(think)_: I’m a spork. I go in a mouth once and then I’m finished. The bin is where finished things go. Excuse me.  
_He walks straight to the wastepaper basket and dives in headfirst. Woody pulls him out, and he dives in again._  
**Woody** _(sad)_: Every night. I’m going to be doing this every night, aren’t I?  

**Choices**

- **Take the first shift guarding the bin.** — sets `{"mv-ts-forky":"guard"}`
    - Forky tries eleven times. Your Nubbins sit in the bin and politely hand him back each time.
    - **Forky**: This bin is full of soft things. It’s very confusing.
- **Try to explain to Forky what a toy is.** — sets `{"mv-ts-forky":"explain"}`
    - **You**: A toy is for a kid. Bonnie is your kid.
    - **Forky**: Is a kid like a bin? It sounds like a bin.

#### Done `mv-ts12-forky-done`

_By sunrise Forky is asleep in Bonnie’s hand, and Woody is asleep on the floor beside the bin._  
_Bonnie’s family is going on a road trip in a rented camper van. Forky is coming, and so is everyone._  

### Step 2: Walk Forky back to the town where Bonnie’s family is staying.

Hint: A night expedition along the verge. Stay out of headlights, and watch Forky near bins. · check: `expedition:complete:mv-ts-roadside-night`

#### Scene `mv-ts12-road`

_The camper van rattles down the highway. Forky spots an open window and jumps out of it, cheerfully, at sixty miles an hour._  
**Woody** _(angry)_: Tell Buzz to keep everyone together. I’ll get him and meet you at the campsite.  
_Woody jumps after him. Before you can think about it, you and your Nubbins have jumped too._  
_A long walk in the dark beside the road. Forky waddles ahead, looking for bins, and finding several._  
**Forky** _(think)_: Why do you keep getting me back? What is a Bonnie, anyway?  
**Woody** _(soft)_: She’s… she’s why we’re here. When she’s sad, you’re there. When she’s scared, you hold on. That’s the job.  
**Woody** _(soft)_: I had a kid before. Andy. Best years I ever had. I’d do every one of them again.  
**Forky** _(think)_: So it’s like a bin. But warm. And the bin loves you back.  
**Woody** _(happy)_: …Yeah. Sure. That’s close enough.  
_Forky stops. He looks at the name written on his feet, and something clicks, like a lid going on properly._  
**Forky** _(happy)_: I’m Bonnie’s. I’m Bonnie’s! I have to get back to her right now!  

**Choices**

- **Ask Woody more about Andy.** — sets `{"mv-ts-walk":"andy"}`
    - **Woody**: He used to send me down the stairs on a tray so I’d go faster. I loved it. Don’t tell Bonnie.
- **Ask Forky what he remembers about being a spork.** — sets `{"mv-ts-walk":"forky"}`
    - **Forky**: A tray. A light. A lot of beans. I didn’t enjoy it.

#### Done `mv-ts12-road-done`

_By morning you reach the town. A carnival is going up in the square, and beside it is a shop called Second Chance Antiques._  
_In its window stands a lamp. Woody knows it at once: it used to be in Andy’s sister’s room, with a shepherdess on top._  
**Woody** _(shock)_: Bo.  

### Step 3: Get out of Second Chance Antiques before the dummies catch you.

Hint: Stealth among the shelves. The dummies can’t see you behind glass. · check: `expedition:complete:mv-ts-antique-store:stealth`

#### Scene `mv-ts12-antique`

_Second Chance Antiques is cool and dim and smells of dust and furniture polish. Every shelf is a hiding place._  
_A doll in a yellow dress rolls up in a pram pushed by a ventriloquist’s dummy. Three more dummies stand behind her, perfectly still._  
**Gabby Gabby** _(happy)_: Hello there! Aren’t you a handsome old thing. Gabby Gabby, pleased to meet you. And who’s this little utensil?  
**Forky** _(happy)_: I’m Forky. I belong to Bonnie. I only recently found out.  
**Gabby Gabby** _(think)_: How lovely. Woody, would you mind awfully if I asked about your pull-string? What’s on the other end of it?  
_Woody’s pull-string says something bright and Western, the way it always has. Gabby’s eyes go soft and hungry at once._  
**Gabby Gabby** _(sad)_: Mine came broken from the factory. Nobody has ever wanted me. One little part is all it would take.  
_The dummies move, and one grabs Forky. The others come for Woody, and your Nubbins get between them._  
**Woody** _(shock)_: Run! Forky, I’ll come back for you! I promise!  

**Choices**

- **Stand and fight the dummies so Woody can grab Forky.** — sets `{"mv-ts-antique":"fought"}`
    - Your Nubbins knock one dummy flat. Two more step up in his place, slowly, without a sound.
    - **Woody**: Too many! Out, out, out!
- **Grab Woody and run. Come back with a plan.** — sets `{"mv-ts-antique":"fled"}`
    - **Woody**: I hate this. I hate this. You’re right.

#### Done `mv-ts12-antique-done`

_You, Woody and your Nubbins tumble out through the letterbox into the street. Forky stays behind, in Gabby’s cabinet._  
**Woody** _(sad)_: I told Bonnie I’d look after him. Well, I told nobody, but I meant it. It’s the one job I’ve got left.  
_Through the glass, Forky waves cheerfully from between two dummies. He has not yet learned that he ought to be scared._  

#### Complete `mv-ts12-complete`

_In the playground across the street, Woody sits on a bench, shaking. Then a shepherd’s crook hooks him round the neck._  
**Bo Peep** _(happy)_: Well, would you look at that. Sheriff Woody. You lost?  
_It’s Bo Peep, with no skirt now: a cape, a crook she swings like a quarterstaff, and one sheep with three heads, all wagging at your Nubbins._  
**Woody** _(shock)_: Bo! You’re… you’re lost! Are you lost? Do you need help?  
**Bo Peep** _(happy)_: I’ve been lost for years, Woody. Best thing that ever happened to me. No kid, no shelf. The whole world’s my room.  
_A tiny police officer pops out of Bo’s pocket: Giggle McDimples, an inch high and in charge._  
**Giggle McDimples** _(happy)_: Bo’s told me all about you. You’re shorter than she said.  
**Bo Peep** _(think)_: There’s a stuntman at the carnival who owes me a favour. Duke Caboom. If you want your spork back, we’ll need him.  
**Bo Peep** _(soft)_: One question first, Sheriff. When did your kid last pick you? Not the spork. You.  
_Woody opens his mouth and doesn’t answer. Bo gives you a scrap of her old pink skirt for a scarf. She doesn’t wear it now, but it’s still good._  

**Rewards**

- Shepherdess Scarf (cosmetic): A scrap of Bo Peep’s old pink skirt, worn as a scarf by any Nubbin.
- Lost and Found (title): Keeper title for following Woody from Andy’s room to the antique store.
- Toy Story Line Complete (flag): Completes the Toy Story line (TS1–TS12). Opens So Long, Partner (E5).

Sets on completion: `{"mv-ts12":true,"mv-ts-complete":true}`

**Notes:** Completes the line and hands straight into E5 (the carnival): Forky is still in Gabby’s cabinet, Woody still has his voice box, Duke Caboom is named but not met. Gabby Gabby is not a villain in E5, so keep her lonely rather than evil; the Benson dummies are the scary part (stiff, silent, sudden). Giggle McDimples is tiny: draw her portrait at a smaller scale. Bo’s sheep are one three-headed toy (Billy, Goat and Gruff in the source; no need to name them). Buzz is with Bonnie’s family off-screen in this storyline; his voice-button “inner voice” begins in E5. Bonnie’s closet is where Woody now spends playtime; Dolly leads Bonnie’s toys. Bonnie pinning Woody’s star on Jessie is from the film’s opening; the closet calendar is ours. Bo’s question at the end (when did your kid last pick you?) is deliberately left unanswered: E5 answers it.
