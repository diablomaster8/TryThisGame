# Fun quests: It's Always Sunny (Q31–Q45, adults only)

## Q31. Kitten Mittens

*It’s Always Sunny in Philadelphia: Charlie’s Kitten Mittens advert* · audience: adult · where: Puddle’s Pub, by the stream · when: Any evening once the pub is open, and only if Settings › Content › “Mature content” is set to 18+ (off by default); Corky stamps around the bar and waves you in. Never during Chapters 9–11.

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Rook (Mac, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia)

### Step 1: Collect 4 dandelion fluff and bring it to Corky at Puddle’s Pub.

Hint: Dandelions grow along the stream bank; shake one gently and catch the fluff before it blows away. · check: `deliver:dandelion-fluff:4`

#### Scene `q31-intro`

_Puddle’s Pub sags over the stream. Inside, something is clomping. Loudly. On purpose._  
**Corky** _(shock)_: You hear that? You hear that clomping? That’s a Nubbin. Walking. Like an animal.  
_It is Corky, stamping round the bar in his boots to demonstrate. Three Nubbins asleep by the fire wake up and glare._  
**Corky** _(angry)_: Every night. Clomp, clomp, clomp. Nobody in this whole Grove has slept since I got here.  
**Dabney** _(think)_: Corky, you sleep twenty hours a day. In a cupboard.  
**Corky** _(happy)_: Not any more, Dabney. Because I invented these.  
_He holds up four tiny mittens. They are lumpy, mismatched and stitched with what might be fishing line._  
**Corky** _(happy)_: Mittens. For their feet. Pat, pat, pat instead of clomp. I’m shooting an advert tonight and I’m gonna be rich.  
**Rook**: And I’m doing the action. Every good advert needs a guy who can kick a candle out without touching it.  
**Dabney**: Nobody has ever needed that.  
**Fitz** _(think)_: Hold on. Rich? How rich? Who owns the mittens? Has anybody written anything down?  
**Corky**: Nobody writes stuff down here, Fitz. That’s our whole system.  
**Corky**: I need fluff. Soft stuff, for the padding. Get me some dandelion fluff and we roll camera.  

#### Done `q31-fluff-done`

**Corky** _(happy)_: Perfect. Soft. Kind of damp. Where’s it been? Doesn’t matter.  
_He stuffs the fluff into the mittens with a fork. Some of it goes in his mouth. He does not notice._  
**Mags**: I’m in the advert too, right? I trained in commercial work. I can cry on cue.  
**Rook**: Nobody cries in a mitten advert, Mags. Sit down. You look like a pelican waiting for chips.  

### Step 2: Film Corky’s advert in Photo mode while the mittened Nubbin pads across the set.

Hint: Open Photo mode in the pub and take the shot when Corky points and the Nubbin is on the bedsheet. · check: `photo:scene:nubbin-mittens-advert`

#### Scene `q31-advert`

_The pub is the set. A bedsheet is the backdrop. Fitz holds a lantern over his head and is already complaining._  
**Fitz**: Hurry it up. I’ve got a ham in the oven and it’s been in there since Tuesday.  
**Corky**: You hold the Photo thing. When I point, you shoot. Don’t shoot when I don’t point. Unless it’s good.  
_A Nubbin is gently fitted with four mittens. It looks down at its feet with deep suspicion._  
**Corky** _(happy)_: Are you tired of your Nubbins clomping around? Is your whole home just a clomping mess?  
**Corky** _(angry)_: Is it stomp, stomp, stomp, all day, all night, while you’re trying to live your life? While you’re trying to EAT?  
**Rook**: Hi-YAH!  
_Rook spin-kicks into frame, misses the candle by a foot and lands on the bar._  
**Corky** _(shock)_: Kitten Mittens!  
**Dabney**: They’re for Nubbins, Corky. The box says Nubbin Mittens. You painted the box.  
**Corky** _(angry)_: I can’t read the box, Dabney!  

**Choices**

- **Cut Rook out of the shot.** — sets `{"q31-rook":"cut"}`
    - **Rook**: You can’t cut the action. The action IS the advert.
    - **Corky**: The mittens are the advert, man!
- **Keep Rook in. Get his best side.** — sets `{"q31-rook":"kept"}`
    - **Rook**: Finally. A director who gets it.
    - He poses. There is no best side. You shoot anyway.
- **Tell Corky to go off-script.** — sets `{"q31-rook":"wildcard"}`
    - **Corky**: Wildcard, bitches!
    - He wraps himself in the bedsheet and runs face-first into the backdrop pole.

#### Done `q31-shoot-done`

_The set comes down. All of it. Corky is somewhere under the bedsheet, still pitching._  
**Corky**: Clomp no more! Call now! We don’t have a number! Come to the pub!  
_The mittened Nubbin pads past two sleeping friends. Neither of them stirs._  
**Dabney** _(think)_: Wait. That worked. I’ll handle marketing. Forty percent, and a better-looking face on the box. Mine.  
**Fitz**: I’ll put up the money. Fifty-fifty. Sixty-forty. Seventy-thirty, me.  
**Corky** _(happy)_: Deal. I don’t know what any of those mean.  
_Fitz spits in his palm and holds it out. Corky spits in his and reaches across. Then both of them look at you._  

**Choices**

- **Tell Corky what seventy-thirty means.** — sets `{"q31-deal":"warned"}`
    - **Corky**: So he gets seventy mittens and I get… thirty mittens?
    - **Corky**: Thirty’s loads of mittens. I’ve never had thirty of anything. Shake, Fitz.
    - **Fitz**: Stay out of my business, Keeper. Kid was happy till you did maths at him.
- **Stay out of it. His invention, his deal.** — sets `{"q31-deal":"stayed-out"}`
    - They shake. The noise is wet. Dabney writes “40%” on a beer mat and slides it into his own pocket.
    - **Fitz**: Pleasure. Now beat it, I’ve got a ham to check on. It’s Thursday.

#### Complete `q31-complete`

**Dabney**: Huh. It actually works. That’s upsetting.  
**Corky** _(happy)_: Of course it works. I’m a genius. I’m a genius who also does the bins.  
_Corky presses a pair of mittens into your hands. They smell faintly of the fork._  
**Corky** _(happy)_: Your Nubbins can walk past sleepy ones now and nobody wakes up. Kitten Mittens!  
_Nubbin Mittens: sleeping Nubbins no longer wake when others walk past. A pair of mittens joins your wardrobe._  

**Rewards**

- Nubbin Mittens (feature): Sleeping Nubbins never wake when other Nubbins walk past them.
- Mittens (cosmetic): Lumpy, mismatched foot mittens a Nubbin can wear. Stitched with fishing line.

**Notes:** Lead: Corky. Introduces the whole gang; Q32–Q45 require it. Content gate: Q31 offers itself only when Settings › Content › “Mature content” is set to 18+, which is off by default; Q32–Q45 inherit this gate through requires: ['Q31']. Running gag: the product is Nubbin Mittens, Corky only ever says the old name (approved quote, used twice). Step 2 needs a scripted Photo mode target on the pub bedsheet; the shot counts if the mittened Nubbin is in frame. Set collapse: bedsheet and pole fall, lantern swings; comedy crash SFX. Rook’s kick is a one-off pose animation. Mittens should mute footstep SFX. The q31-deal choice (warn Corky about Fitz’s 70/30 or stay out of it) is flavour only; Corky signs either way.

## Q32. Charlie Work

*It’s Always Sunny in Philadelphia: “Charlie Work”* · audience: adult · where: Puddle’s Pub, by the stream · when: A morning after Q31; a health inspection notice is nailed to the pub door. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Inspector Thimble

### Step 1: Hand Corky the right tool on every cue through the rat cellar and the pond drain.

Hint: Watch Corky’s hand: open palm for the stick, a fist for the plunger, both hands for the bucket. Miss three and the take restarts. · check: `minigame:tool-relay:cellar-drain`

#### Scene `q32-intro`

_A notice on the pub door: HEALTH INSPECTION, TODAY, NOON. Someone has drawn a skull on it. It may be official._  
**Dabney**: Right. Upstairs, we are busy. With a thing that is completely legal and involves forty crates of eggs.  
**Mags** _(shock)_: Don’t tell them about the eggs!  
**Dabney**: I just did, Mags. Keep up. You’re like a flamingo trying to do sums.  
**Fitz** _(happy)_: We bought every egg in the valley. By Friday there’s no eggs anywhere. Saturday, we’re the egg men.  
**Dabney**: Supply and demand. It isn’t a scheme if it’s economics.  
_Nobody asks who will clean. Everyone simply turns and looks at Corky._  
**Corky** _(happy)_: Okay. Okay. This is my time. You stick with me. You hand me stuff. We don’t stop.  
**Corky**: One go. Cellar, drain, bins, whatever’s in the back. If we stop, it all falls apart. Like a shark.  
_He grabs a stick wrapped in tape. He calls it the rat stick. He has never once hit a rat with it._  
**Corky** _(soft)_: Me and the rats have an understanding. I bang the pipes, they leave. They come back. It’s a cycle. It’s beautiful.  
**Corky**: Stick. Plunger. Bucket. When I say it, you hand it. Go.  

**Choices**

- **Hand him the rat stick first.** — sets `{"q32-first":"stick"}`
    - **Corky**: Yes! Instinct! You’ve done this before.
    - He bangs a pipe three times. Six rats stroll out in single file, looking bored.
- **Hand him the plunger first.** — sets `{"q32-first":"plunger"}`
    - **Corky**: Plunger? In the cellar? Oh, you’re thinking ahead. I love it. I’m scared.

#### Done `q32-cellar-done`

_The drain gives with a sound like a cow sighing. Something black and ancient slides out. Corky catches it in the bucket._  
**Corky** _(happy)_: Pond hair! That’s good luck. That’s a whole wig.  
_Upstairs, through the floorboards, you hear Dabney say the word “eggs” with great confidence._  

### Step 2: Keep the take going: hand Corky his tools through the bins, then get the goose out of the back room.

Hint: The goose only leaves through an open door with fruit outside it; hand Corky a pear right after the big gloves. · check: `minigame:tool-relay:bins-goose`

#### Scene `q32-goose`

**Inspector Thimble**: Good morning. Inspector Thimble. I’ll be looking at everything, and writing everything down.  
_Corky walks past behind her with a bin on his shoulder, not breaking stride, and gives you a single nod._  
**Corky** _(think)_: Bins next. Then there’s the goose.  
**You**: What goose?  
**Corky**: There’s always a goose. Nobody knows how it gets in. It’s been in the back room since spring. It hates me.  
_The back room door bulges slightly. Something on the other side hisses._  
**Inspector Thimble** _(think)_: What is that noise?  
**Mags** _(happy)_: Atmosphere! It’s an atmospheric pub. I’m a trained performer, I’d know.  
**Fitz**: Keep her upstairs. I need eleven more minutes with the eggs.  
**Corky**: Bin bag. Big gloves. Then we open the door and we do not look the goose in the eye.  
**Inspector Thimble** _(think)_: You. You look like the only person here who has slept. What is happening upstairs?  

**Choices**

- **Cover for the gang: “Choir practice.”** — sets `{"q32-inspector":"covered"}`
    - **Inspector Thimble**: A choir. That clucks.
    - Upstairs, on cue, Mags starts singing scales. It does not help. It may have made things worse.
- **Tell her the truth about the eggs.** — sets `{"q32-inspector":"told"}`
    - **Inspector Thimble**: Hoarding eggs isn’t a health matter. It’s just sad. I’ll make a note.
    - **Dabney**: WHO TOLD HER? I can hear you writing!
- **Point her at the man doing the actual work.** — sets `{"q32-inspector":"corky"}`
    - She turns. Corky is halfway inside a drain, humming, with a candle in his mouth.
    - **Inspector Thimble**: Who is that man? How long has he been here?
    - **Corky**: Nobody. Always. Keep walking, lady.

#### Done `q32-bins-done`

_The goose leaves on its own terms, with a pear, and bites Corky on the way out as a matter of principle._  
**Corky** _(happy)_: It bit me! It respects me now!  
_The goose waddles off down the stream bank, unharmed and deeply smug._  

#### Complete `q32-complete`

**Inspector Thimble** _(shock)_: The cellar is… clean. The drain is clear. There is no goose. I don’t understand what I’m looking at.  
**Inspector Thimble**: Upstairs, however, smells strongly of eggs and lies. Pass. Just.  
**Dabney** _(happy)_: A pass! Because of our scheme.  
**Corky**: Because of me, Dabney. Because of me and the stick.  
**Dabney**: Nobody is ever going to remember the stick, Corky.  
_Nobody thanks him. He doesn’t seem to expect it. He hands you his spare gloves, stiff and dark with something._  
**Corky** _(soft)_: You did good. Teach one of your little guys the long take. It’ll tidy up after itself.  
_Grove Work: one chosen Nubbin piles up fallen fruit and leaves on its own. Filthy work gloves join your wardrobe._  

**Rewards**

- Grove Work (feature): Choose one Nubbin to gather fallen fruit and leaves into tidy piles by itself.
- Filthy Work Gloves (cosmetic): Corky’s spare gloves. Stiff, dark, and best not sniffed.

**Notes:** Lead: Corky. Stage both relay steps as one continuous tracking shot following Corky (cellar → drain → bins → back room) with the gang’s egg scheme heard through the ceiling. No animal is ever hit: the rat stick only bangs pipes, rats stroll out unharmed, the goose leaves with a pear and bites Corky. SFX: pipe clangs, drain gurgle, goose hiss and honk, muffled upstairs chatter. q32-inspector (covered / told / corky) is flavour only: the pub passes either way. The question is loyalty to the gang versus honesty, and who notices the work.

## Q33. Fight Milk

*It’s Always Sunny in Philadelphia: Mac and Charlie’s Fight Milk* · audience: adult · where: Puddle’s Pub, by the stream · when: After Q31, once karate is unlocked; Rook and Corky are stirring a bucket behind the bar. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Rook (Mac, It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia)

### Step 1: Drink a carton of Fight Milk at the bar.

Hint: Take the carton from the bar and choose Drink. Stay near a bench; you’ll want one. · check: `use:item:fight-milk`

#### Scene `q33-pitch`

_Behind the bar, Rook and Corky are stirring a bucket with a cricket bat. The bucket is warm. Nobody has heated it._  
**Rook** _(happy)_: Behold. The world’s first boozy milk for bodyguards. Protein, dairy, vodka. Everything a body needs to guard.  
**Corky**: Milk, vodka and crow eggs. Raw. We got the eggs off the mill roof.  
**Dabney** _(think)_: You stole eggs from crows.  
**Corky**: Borrowed. The crows get them back, technically, once they’re inside us.  
**Rook** _(happy)_: For bodyguards, by bodyguards.  
**Mags**: You’re not bodyguards. You’ve never guarded a body.  
**Rook** _(angry)_: I guarded this bucket all night, Mags. Nobody got near it.  
**Dabney**: Nobody wanted to get near it.  
**Corky**: We need a tester. Someone brave. Strong stomach. No plans this afternoon.  
_Everyone looks at you. A carton slides across the bar. It is lumpy at the top._  

**Choices**

- **Chug the lot.** — sets `{"q33-drink":"chug"}`
    - **Rook**: That’s what I’m talking about! Feel the guard!
    - You feel something. It is not the guard.
- **Take one careful sip.** — sets `{"q33-drink":"sip"}`
    - **Corky**: A sip! Fancy! Like a fancy bodyguard!
    - One sip is plenty. Your left eye starts watering on its own.
- **Sniff it first.** — sets `{"q33-drink":"sniff"}`
    - It smells like a wet dog that has been to a wedding.
    - **Rook**: The smell is part of the experience. Drink.

#### Done `q33-taste-done`

_The world tilts gently to the left and stays there. You have hiccups that taste of eggs._  
**Corky** _(happy)_: Look at that. Wobbly but strong. Strong but wobbly. That’s the brand.  
**Rook**: Write that down, Corky.  
**Corky**: I don’t write, man.  

### Step 2: Get Dabney, Mags and Fitz to each drink a carton of Fight Milk.

Hint: Carry cartons to each of them and choose Offer. Fitz says yes to anything; Dabney needs persuading. · check: `give:fight-milk:gang:3`

#### Scene `q33-testers`

**Rook**: One tester is science. Four testers is a study. Get the others to drink it.  
**Dabney**: Absolutely not. My body is a temple and that is a bucket.  
**Fitz** _(happy)_: I’ll drink anything. I drank lamp oil once on a bet. Won forty shells, lost a week.  
**Mags**: If I drink it, do I get to be in the advert?  
**Rook**: There’s no advert.  
**Mags**: Then I want an advert.  
_Outside, on the mill roof, a row of crows has turned to face the pub. All of them. In silence._  
**Corky** _(shock)_: Caw! Caw! They know. They know what we did. Drink faster.  

**Choices**

- **Tell Dabney it’s good for his skin.** — sets `{"q33-dabney":"flattered"}`
    - **Dabney**: Well. My skin does deserve the best.
    - It does not get the best.
- **Bet Dabney he can’t keep it down.** — sets `{"q33-dabney":"dared"}`
    - **Dabney**: I can keep anything down. Watch me.
    - You watch. You wish you hadn’t.

#### Done `q33-sick`

_Dabney turns a precise shade of green and admires it in a spoon. Mags is sick in her handbag, then sobs because it’s her good one._  
_Fitz is sick out of the window, onto the crows, who take it personally. Rook goes blue, then purple, and says he feels incredible._  
_A Nubbin wanders over, sniffs a spilled carton, gives you a look of open disappointment and walks away._  
**Rook** _(happy)_: Great data. Now the label. Keeper, you’ve got the steadiest hand. What do we say about the trial?  

**Choices**

- **Write: “Side effects: everyone.”** — sets `{"q33-label":"honest"}`
    - **Rook**: Bold. Very bodyguard. Bodyguards don’t hide stuff.
    - **Corky**: People respect honest. People respect sick. We’re both!
- **Write: “Tested on five brave adults.”** — sets `{"q33-label":"spin"}`
    - **Dabney**: Technically true. I love it. I hate that I love it.
    - **Mags**: Put “and one actress”. I want a credit.
- **Write: “Contains crow eggs.”** — sets `{"q33-label":"crows"}`
    - **Corky**: No! Don’t write it down! Then the crows can read it!
    - On the mill roof, every crow leans forward at once.

#### Complete `q33-complete`

**Rook** _(happy)_: Results are in. Everyone threw up. Except Corky. And me. I definitely didn’t.  
**Corky** _(happy)_: My stomach’s used to worse. I had a glue sandwich Thursday.  
**Dabney**: That is not the endorsement you think it is.  
**Rook**: We’re gonna sell a million of these. Starting with one. To you. Free.  
_A crow lands on the bar, takes a full carton in its beak, and flies off with it. Nobody stops it._  
**Corky** _(shock)_: They’re making their own now. We’ve started an arms race. With birds.  
_Rook hands you a carton, and a hat folded out of an empty one. It still drips a little._  
_Fight Milk: drink it before a karate bout for a big Power boost, and a Keeper who can’t walk straight. The carton hat joins your wardrobe._  

**Rewards**

- Fight Milk (item): Single use. The Keeper drinks it before a karate bout: your fighter gets extra Power for that bout, and you wobble for a while afterwards.
- Carton Hat (cosmetic): A Fight Milk carton folded into a hat. Damp.

**Notes:** Lead: Corky (with Rook). Nubbins never drink Fight Milk: they sniff it and walk off; the item can only be used by the Keeper. Each tester gets a distinct visible sick animation (green Dabney, handbag Mags, window Fitz, colour-cycling Rook). Keeper wobble = short drunk-walk camera sway after drinking. Crows on the mill roof turn to face the pub in step 2 and caw once; they never attack anyone. q33-label sets the carton text on the reward item (honest / spin / crows). In the complete scene a crow steals one carton: running gag payoff.

## Q34. Green Man

*It’s Always Sunny in Philadelphia: Charlie’s Green Man suit* · audience: adult · where: The race track stands · when: Any race day after Q31; a man in a green bodysuit is drinking in the stands. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), The Announcer, The Crowd

### Step 1: Lead the crowd: cheer five times during the race.

Hint: Tap Cheer in the stands as the runners pass; the louder the stands, the faster the runners. · check: `race:cheer:5`

#### Scene `q34-stands`

_The race stands are half full. In the middle is a man in skin-tight green spandex from head to toe, face and all._  
**Corky** _(happy)_: Green Man!  
**Dabney**: He’s been like this since breakfast. He won’t take it off. I don’t think he can take it off.  
**Corky**: It’s a lifestyle, Dabney. In the suit, I’m free. I can’t see much, but I’m free.  
_He is drinking beer through the suit. The fabric is doing most of the drinking._  
**Dabney** _(happy)_: I’m five beers in and scoring the runners. That one’s a three. That one’s a cry for help.  
**The Announcer**: Runners to the line, please. And could the green gentleman sit down.  
**Corky** _(angry)_: The green gentleman will NOT sit down!  
**Dabney**: It’s dead in here. Get them cheering before he does something.  

**Choices**

- **Start a chant for the runners.** — sets `{"q34-cheer":"runners"}`
    - You clap a slow beat. One by one, the stands join in. Corky claps on every other beat, on purpose.
- **Start a chant for the man in green.** — sets `{"q34-cheer":"green"}`
    - **Corky**: Yes! Yes! Me! Do me!
    - **Dabney**: You are feeding it. Why would you feed it?

#### Done `q34-climb`

_The crowd roars. Corky takes it personally. He climbs onto the railing._  
**Dabney** _(shock)_: No. Corky. No.  
_He drops onto the track and sprints across it, arms out, the suit still very much on._  

### Step 2: Haul Corky off the race track before he ruins the race.

Hint: Corky zigzags; cut him off at the bends and grab the suit. Leave the Nubbin who follows him, it comes back by itself. · check: `minigame:catch:green-suit`

#### Scene `q34-track`

**The Announcer** _(shock)_: There is a green man on the course. I repeat, a green man.  
_The racing Nubbins stop and watch him go past. One of them trots after him, delighted._  
**Corky** _(happy)_: I’m the fastest thing out here! Nobody can catch the— oh no. A hill.  
_He falls over the first hurdle, gets up, falls over the second, and lies down on the third._  
**Dabney**: Go and get him. I’m not touching that suit. It’s been on him for nine hours.  
**The Announcer**: We will restart when the… participant… is removed.  
_The stands are on their feet for the first time all season. At the start line, the runners’ Keepers are not._  

**Choices**

- **Drag him off now. It’s the runners’ race.** — sets `{"q34-lap":"dragged"}`
    - At the start line, a Keeper who has trained all spring for this race mouths “thank you”.
    - **Corky**: Traitor! Green traitor! You’re supposed to be on the side of the suit!
- **Let him finish one lap. Listen to that crowd.** — sets `{"q34-lap":"lap"}`
    - Corky runs a full lap, arms out, to the loudest noise the stands have made all year. The runners wait, stretching.
    - **Dabney**: You gave him a lap. Now he’s going to want a parade.

#### Done `q34-haul-done`

_You drag him off by one green ankle. He waves to the crowd the whole way._  
**Corky** _(happy)_: They love me. Do you hear that? That’s love.  

#### Complete `q34-complete`

_The race restarts. Every time a runner passes, people at the back shout for the man in green._  
**The Announcer**: And the winner is… well. The crowd seems to have its own favourite.  
**The Crowd** _(happy)_: Green Man!  
**Dabney**: Oh, great. Now he has fans.  
**Corky** _(happy)_: Here. Spare suit. I had two made. One for days, one for special days.  
_A green bodysuit joins your wardrobe. From now on, every race has a cheering crowd in the stands._  

**Rewards**

- Green Bodysuit (cosmetic): Head-to-toe green spandex, face included. Drinking through it is possible but wet.
- Cheering Crowd (feature): Every race now has a crowd in the stands that cheers your runners on.

**Notes:** Lead: Corky. Corky streaks with the suit fully on: no nudity of any kind. He is drunk in the stands with Dabney. The racing Nubbin that follows him is never at risk; the catch minigame pauses the race. Art: green bodysuit on Corky (featureless face), wet patch at the mouth. SFX: crowd swell on each cheer, announcer PA crackle. q34-lap (dragged / lap): “lap” plays one scripted lap of Corky before the catch minigame starts.

## Q35. Chardee MacDennis

*It’s Always Sunny in Philadelphia: “Chardee MacDennis: The Game of Games”* · audience: adult · where: Puddle’s Pub, by the stream · when: Any night after Q31, after closing; the board is laid out on the bar. Never during Chapters 9–11. · requires: Q31

**Cast:** Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Rook (Mac, It’s Always Sunny in Philadelphia)

### Step 1: Win the Mind level against Dabney and Mags.

Hint: The insult cards aren’t really questions: answer fast and with confidence. Hesitate and your team drinks. · check: `minigame:board-game:mind`

#### Scene `q35-rules`

_The pub is closed. A board game the size of a door lies on the bar, stained with every drink known to the Grove._  
**Dabney** _(happy)_: Chardee MacDennis: the game of games.  
**Corky**: Nobody knows what the name means. It was on the box. I tried to read the box once.  
**Mags**: Dabney and I are the champions. Undefeated. Twice. Ever.  
**Dabney**: Three levels. Mind, Body, Spirit. Lose a level, you drink. Lose the game, you drink more and apologise.  
**Rook**: Me, Corky and the Keeper. Team Brute Force. We’ve been practising.  
**Dabney**: You’ve been practising saying “Team Brute Force”.  
_Level one is Mind. The cards are mostly insults phrased as questions._  
**Mags** _(happy)_: Rook. True or false: you look like a sad potato in a karate belt.  
**Rook** _(angry)_: False! It’s a black belt. A potato couldn’t get a black belt.  
**Dabney**: That’s a true. Drink. Keeper, your card: name the biggest disappointment in this room.  

**Choices**

- **Point at Mags.** — sets `{"q35-answer":"mags"}`
    - **Mags**: You absolute stork!
    - **Dabney**: Correct. Point to Brute Force.
- **Point at Dabney.** — sets `{"q35-answer":"dabney"}`
    - **Dabney**: Wrong. The answer is never me. That’s in the rules. I wrote the rules.
- **Point at the board.** — sets `{"q35-answer":"board"}`
    - **Corky**: Ha! The board! Yeah! Hey, wait. That’s our board.

#### Done `q35-mind-done`

**Dabney**: Fine. Lucky. Mind was always our weakest level, because we’re too clever for it.  
**Corky** _(happy)_: We won a level! I don’t know which one!  

### Step 2: Survive the Body level: do your dare and win the arm-wrestle against Mags.

Hint: Tap in time with the bar to arm-wrestle; Mags tires after ten seconds. · check: `minigame:board-game:body`

#### Scene `q35-dares`

_Level two is Body. The cards are dares, and the dares are bad._  
**Mags**: Rook. Eat a spoonful of the stuff at the bottom of the pickled egg jar.  
**Rook**: Easy. Brute Force.  
_He does. He is very quiet for some time afterwards._  
**Dabney**: Corky. Lick the bar. The whole length.  
**Corky** _(happy)_: I do that anyway.  
_He does it with real joy. A coin comes up stuck to his tongue. He keeps it._  
**Mags**: Dabney. Your dare: say one nice thing about me.  
_Dabney opens his mouth. Closes it. Thinks. Takes the drink without a word._  
**Dabney**: And the Keeper. Arm-wrestle Mags. Loser drinks from the drip tray.  
**Mags** _(happy)_: I’ve got arms like a heron. Long. Strong. Terrifying.  
**Dabney**: You do have arms like a heron, Mags. That isn’t the compliment you think it is.  

#### Done `q35-body-done`

_Mags goes down. Dabney, unasked, stands on his chair and drinks the whole drip tray to prove a point nobody made._  
**Dabney** _(happy)_: I am a golden god!  
_He sits down very, very slowly._  

### Step 3: Win the Spirit level and take the title.

Hint: Spirit rewards honesty, nerve or tears. Fill the meter before the candle burns down. · check: `minigame:board-game:spirit`

#### Scene `q35-truths`

_Level three is Spirit. The lights go down. Mags lights a candle and won’t say where she got it._  
**Dabney**: Spirit is about truth. Each side says something true about themselves. The weakest truth loses.  
**Corky** _(sad)_: I don’t like Spirit. Somebody always cries in Spirit.  
**Mags**: You cried last time.  
**Corky** _(sad)_: Because Dabney said rats don’t have feelings! They have feelings, Mags!  
**Rook** _(sad)_: I’ll go. Truth. I don’t actually know any karate. I learned it all off a poster.  
_Silence. Then Rook starts crying, hard, into the board._  
**Mags** _(happy)_: My turn. Truth: I am the most talented person in this room.  
**Dabney**: That isn’t a truth, Mags. That’s a symptom.  
**Dabney** _(think)_: Rook’s, though. That was a strong truth. Keeper? Beat it.  

**Choices**

- **Tell a real truth.** — sets `{"q35-spirit":"truth"}`
    - You say something small and true. Nobody laughs. Mags hugs a cushion.
    - **Dabney**: Disgusting. Point to Brute Force.
- **Make up something huge.** — sets `{"q35-spirit":"lie"}`
    - **Corky**: Whoa. You fought a bear? On a boat? In the rain?
    - **Dabney**: That’s a lie. It’s a beautiful lie. Point.
- **Just start crying.** — sets `{"q35-spirit":"cry"}`
    - **Mags**: Now I’m crying. Why am I crying?
    - **Corky**: Everybody’s crying. It’s Spirit, man.

#### Complete `q35-complete`

_The candle gutters out. On the scoreboard, in Corky’s handwriting, is something that is probably a win._  
**Rook** _(happy)_: Brute Force! Brute Force! We beat the champions!  
**Mags** _(angry)_: This is a fix. You all cheated. I want a recount.  
**Dabney** _(angry)_: There will be a rematch. And I will crush every one of you.  
**Corky** _(happy)_: You take the trophy. I already licked it.  
_You take home the board, the trophy, and a new title for your profile: Game of Games._  

**Rewards**

- Game Board (decor): The stained, door-sized board, for propping against a wall.
- Trophy (decor): A tarnished trophy. Already licked.
- Game of Games (title): A profile title for the Keeper who beat the champions.

**Notes:** Lead: Dabney (with Mags). One sitting, start to finish: if the player leaves the pub mid-game, the game resets to Mind. Three minigames share one board UI with a level track (Mind / Body / Spirit). Drinking is shown as a gulp and a screen sway, nothing more. The in-world name is never explained; that is the joke. Spirit: dim the pub to candlelight; soft piano sting when Rook cries.

## Q36. Rum Ham

*It’s Always Sunny in Philadelphia: “The Gang Goes to the Jersey Shore”* · audience: adult · where: The pond · when: A warm day after Q32; Fitz and Corky are pushing a raft into the water. Needs a Nubbin with some Swim. Never during Chapters 9–11. · requires: Q31, Q32

**Cast:** Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia)

### Step 1: Send a Swim Nubbin after the rum ham, once round the pond.

Hint: Tap a Nubbin with good Swim and point at the ham; it drifts with the current, anticlockwise. · check: `swim:chase:rum-ham:1`

#### Scene `q36-bender`

_Fitz is at the pond with a raft, a bucket and a whole ham. The ham is in the bucket. The bucket is full of rum._  
**Fitz** _(happy)_: Soaked it overnight. Every bite’s a drink. Every drink’s a bite. It’s efficient.  
**Corky** _(happy)_: Rum ham!  
**Fitz**: Beach day. There’s no beach, so the pond’s the beach. Don’t think about it.  
_They push off. They eat the ham. They drink the ham. Within the hour both are asleep, face down on the raft._  
_The current takes the ham. It bobs away across the pond, glistening, faintly steaming._  
**Corky** _(shock)_: The ham. The ham’s leaving. Why is the ham leaving?  
**Fitz** _(sad)_: Get it back. That ham is my whole holiday.  

**Choices**

- **Promise Fitz you’ll get his ham back.** — sets `{"q36-promise":true}`
    - **Fitz**: Good. You’re a good kid. I’ll put you in my will. Near the bottom.
- **Tell him the ham has made its choice.** — sets `{"q36-promise":false}`
    - **Fitz**: The ham doesn’t get a choice! I paid for that ham!
    - **Corky**: Let the ham be free, Fitz…

#### Done `q36-lap-one-done`

_Your Nubbin paddles up to the ham, sniffs it, sneezes, and nudges it with its nose. The ham catches the current and sails on._  
**Corky**: So close! It touched it! Ham’s slippery, man.  

### Step 2: Send your Swim Nubbin round the pond again and push the ham back to the raft.

Hint: Cut across the middle this time; the ham slows down as it passes the reeds. · check: `swim:chase:rum-ham:2`

#### Scene `q36-trying-time`

_Second lap. The ham is in the middle of the pond now, turning slowly, as if it owns the place._  
**Fitz** _(sad)_: Stuck on a raft. No ham. No paddle. This is the worst day of my life.  
**Fitz**: Can I offer you a nice egg in this trying time?  
_He holds out a hard-boiled egg he has been keeping in his shirt pocket. It is warm._  
**Corky**: Yes. Thank you. I’ll take that.  
_Corky eats it, shell and all, and gives a thumbs up to your Nubbin out on the water._  
_Across the pond, a familiar goose has seen the ham. It pushes off from the reeds with terrible purpose._  
**Corky** _(shock)_: No. Not him. Not the goose. He’s been waiting for this his whole life.  

**Choices**

- **Race the goose straight for the ham.** — sets `{"q36-goose":"raced"}`
    - Your Nubbin paddles flat out. The goose honks the whole way, like a horn with opinions.
- **Distract the goose with another egg.** — sets `{"q36-goose":"egg"}`
    - Fitz has another egg. He always has another egg. You throw it, and the goose veers off after it.
    - **Fitz**: That was my emotional support egg!

#### Done `q36-lap-two-done`

_Your Nubbin noses the ham all the way back to the raft and gets a cheer from both men._  
**Fitz** _(happy)_: Rum ham!  

#### Complete `q36-complete`

_The ham is too waterlogged to eat. Fitz is sad about this for nearly a minute._  
**Fitz**: Don’t waste it. Tie it up out there. Let it be a monument.  
**Corky** _(happy)_: A ham boat! A floaty ham! The little guys can lie on it!  
_Corky lashes the ham to a log. Your Nubbin climbs straight on and lies down, very pleased with itself._  
_On the far bank, the goose watches your Nubbin sunbathe on the ham with naked envy._  
_The Rum Ham pond float joins your decorations. Nubbins lounge on it whenever it’s sunny._  

**Rewards**

- Rum Ham Float (decor): A huge ham lashed to a log in the pond. Nubbins lounge on it in the sun.

**Notes:** Lead: Corky (with Fitz). Nubbins never eat or drink the rum ham; the swimmer only sniffs, sneezes and nudges it. Pond current runs anticlockwise; lap one ends with the ham slipping free, lap two is the real catch. If the player has no Swim-leaning Nubbin, any Nubbin can do it at half speed. Art: glistening ham with a steam wisp, raft with two snoring men. Lap two adds the Q32 goose as a rival swimmer (q36-goose: raced / egg); it never reaches the ham and is never harmed.

## Q37. The Night Keeper Cometh

*It’s Always Sunny in Philadelphia: “The Nightman Cometh” (original song, not the show’s)* · audience: adult · where: Puddle’s Pub, by the stream · when: Any evening after Q31; a handwritten poster for a rock opera is pinned to the pub door. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Rook (Mac, It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Everyone

### Step 1: Talk Rook, Dabney, Mags and Fitz back into rehearsal before they walk out.

Hint: Find each of them around the pub and choose Talk; every one of them wants to hear that their part matters most. · check: `talk:gang:4`

#### Scene `q37-casting`

_A poster on the pub door: THE NIGHT KEEPER COMETH. A ROK OPRA. Most of the letters face the right way._  
**Corky** _(happy)_: It’s a rock opera. I wrote it. It’s about darkness. And light. And a guy who lives under your stairs.  
**Corky**: Rook, you’re the Sun Keeper. Dabney, you’re the troll. Mags, you’re the princess. Fitz, you’re on lights.  
**Rook** _(happy)_: Sun Keeper. The hero. Can I do it with my shirt off?  
**Corky**: You have to. It’s in the script. There’s no script, but it’s in it.  
**Dabney** _(angry)_: A troll. You cast me, of all people, as a troll.  
**Corky**: It’s the best part, man! The troll’s got the best bit! He’s got a bridge!  
**Mags** _(angry)_: The princess has two lines. Two. I have trained for years.  
**Fitz**: I don’t know how lights work. I’ll just hold some fire near things.  
_Rehearsal is in twenty minutes. Every one of them is about to walk out._  

**Choices**

- **Tell Dabney the troll is the real lead.** — sets `{"q37-calm":"dabney"}`
    - **Dabney**: The real lead. Yes. That tracks. The troll is the one they talk about afterwards.
- **Tell Mags the princess is the emotional heart.** — sets `{"q37-calm":"mags"}`
    - **Mags**: I knew it. I could feel it. I’m going to carry this whole thing.
    - **Dabney**: You’re going to carry a jar.
- **Tell Rook to keep his shirt on.** — sets `{"q37-calm":"rook"}`
    - **Rook**: Then how will they know it’s me?

#### Done `q37-rehearsal-done`

_Somehow, all four of them are on the makeshift stage at once. Nobody is happy. That will do._  
**Corky** _(happy)_: Okay. Okay! From the top! Fitz, hit the lights!  
_Fitz sets fire to a small part of the curtain. It goes out by itself. Rehearsal is a success._  
**Mags** _(happy)_: I’ve written myself a third line. It’s about the jar. It explains the jar.  
**Corky** _(angry)_: Nobody explains the jar, Mags. The jar is the mystery. The jar is the whole second act.  

### Step 2: Light the Sun Keeper’s giant lantern on cue so Rook can make his entrance.

Hint: Fitz is holding the lantern upside down. Take it, tap when the drums peak, and keep it lit through the chorus. · check: `minigame:cue:sun-keeper-lantern`

#### Scene `q37-curtain`

_Opening night, by the stream. Lanterns on poles, a bedsheet curtain, and half the Grove sitting on crates._  
**Fitz**: Lights! I think! Everyone shut up!  
_The lanterns go out. A single beam finds Corky in a cape made from a bin bag._  
**Corky** _(think)_: I come out when the lanterns go dark  
**Corky**: I’m the thing you can smell in the park  
**Corky**: I’ve been eating your pears  
**Corky**: I’ve been living under your stairs  
**Corky** _(happy)_: And I’m leaving a little… mark.  
_Silence. Somewhere at the back, a Nubbin claps. It is the only one._  
**Corky** _(shock)_: Sun Keeper! That’s your cue! Fitz, the lantern! The big lantern!  

#### Done `q37-sun-keeper`

_The giant lantern blazes. Rook steps into the light, shirtless and oiled, holding a lantern of his own._  
**Rook** _(happy)_: SUN KEEPER! (hey! hey!)  
**Rook**: Lighter of the lanterns! (hey! hey!)  
**Rook**: He’s got a giant lantern and abs you can see  
**Rook** _(happy)_: He’ll punch the dark in the face for you and for me!  

#### Complete `q37-finale`

**Dabney** _(think)_: You want to cross my bridge? Then you pay the bridge fee.  
**Dabney**: And what’s the fee? Whatever’s in your pockets.  
**Dabney**: And your boots.  
**Dabney** _(happy)_: And your dignity.  
**Mags**: I’m the princess and I’m meant to be the star  
**Mags** _(angry)_: So why am I just standing here holding a jar?  
**Everyone** _(happy)_: Night Keeper, Sun Keeper, holding hands at last  
**Everyone**: We spent the whole budget and the lanterns are gas—  
**Dabney** _(angry)_: Stop singing, Fitz.  
_The crowd goes wild, mostly from relief. The open-air stage, Sun and Night capes, and the song on the jukebox are yours._  

**Rewards**

- Open-Air Stage (decor): Corky’s stage by the stream, lantern poles and bedsheet curtain included.
- Sun Keeper Cape (cosmetic): A gold cape that catches the light. Shirt optional.
- Night Keeper Cape (cosmetic): A black cape made from a bin bag. It rustles.
- “The Night Keeper Cometh” on the jukebox (feature): Corky’s rock opera, playable on the pub jukebox any time.

**Notes:** Lead: Corky. The song is the ORIGINAL one from the brief, staged word for word in order across q37-curtain (Night Keeper verse), q37-sun-keeper (Sun Keeper chorus) and q37-finale (troll, princess, everyone, Dabney’s cut-off); straight apostrophes in the brief are typeset as ’ like the rest of the game. No real lyrics. Troll: first line spoken, then sung. Sung lines should show with a music-note tag in the dialogue box. Music: hoarse rock riff (Night Keeper), power ballad with “hey! hey!” crowd shouts (Sun Keeper), off-key solo (princess), group singalong that stops dead on Dabney’s line. Lantern cue minigame sits between verse and chorus.

## Q38. Bird Law

*It’s Always Sunny in Philadelphia: Charlie Kelly, self-taught expert in bird law* · audience: adult · where: Puddle’s Pub, by the stream · when: After Q32, once you have a Fly-leaning Nubbin; three pears go missing from the bar. Never during Chapters 9–11. · requires: Q31, Q32

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia)

### Step 1: Find three pieces of evidence that will clear your Nubbin.

Hint: Check its trust in the Collection book, look at its alignment glow, and search under the bar where the pears were kept. · check: `collect:evidence:bird-law:3`

#### Scene `q38-charge`

_The pub has become a courtroom. The bar is the bench. Fitz sits behind it in a wig made from a mop head._  
**Fitz**: Order! Order. I’ve always wanted to say that. Someone order me a drink.  
**Dabney** _(happy)_: The charge: your Fly Nubbin stole three pears from this bar. I’ll be prosecuting. For fun.  
**Dabney**: I don’t need it to be guilty. I need to win. Those are two completely different jobs.  
_Your Nubbin sits in the dock, which is a fruit crate, and blinks._  
**Corky**: And I’m defending. I’m an expert in bird law.  
**Dabney**: It’s not a bird, Corky. It’s a Nubbin with wings.  
**Corky** _(angry)_: Wings, Dabney! Wings! You don’t think that falls under bird law?  
**Corky**: Bird law in this country is not governed by reason.  
**Fitz**: I’ll allow it.  
**Corky** _(think)_: Get me evidence. Real stuff. I’m gonna be busy objecting.  

**Choices**

- **Tell Corky your Nubbin wouldn’t steal: you feed it every day.** — sets `{"q38-plea":"trust"}`
    - **Corky**: A well-fed bird is an honest bird. That’s bird law. I just made it, but it’s law.
- **Admit it might have done it.** — sets `{"q38-plea":"maybe"}`
    - **Corky**: Never admit! Never! Objection! I object to my own client’s Keeper!
    - **Fitz**: Sustained. Whatever that means.

#### Done `q38-evidence-done`

_You have three things: your Nubbin’s high trust, its soft Hero glow, and a grey goose feather from under the bar._  
**Corky** _(happy)_: A feather! A feather is basically a confession. In bird law.  

### Step 2: Present all three pieces of evidence to Judge Fitz.

Hint: Hand Corky each piece when he shouts “exhibit”; ignore everything else he says. · check: `minigame:trial:bird-law`

#### Scene `q38-court`

**Dabney**: The prosecution calls common sense. The pears were there. Then the Nubbin was there. Then the pears were not.  
**Corky** _(angry)_: Objection!  
**Fitz**: On what grounds?  
**Corky**: On the grounds that he’s talking, and I don’t like it.  
**Fitz**: Sustained.  
**Dabney** _(angry)_: You can’t sustain that.  
**Corky**: The defence calls… the goose.  
_The goose from the back room is led in on a rope it does not accept. It honks at Dabney, then stares at Corky with pure hatred._  
**Corky** _(think)_: Goose. Where were you on the night of the pears?  
_The goose hisses. A small piece of pear falls out of its beak._  

**Choices**

- **Lead with the trust score.** — sets `{"q38-lead":"trust"}`
    - **Fitz**: High trust. This one gets fed. Why would it steal? Good point. I made that point.
- **Lead with the Hero glow.** — sets `{"q38-lead":"glow"}`
    - **Dabney**: Glowing doesn’t prove anything!
    - **Corky**: It proves it’s a good boy, Dabney!
- **Lead with the goose feather.** — sets `{"q38-lead":"feather"}`
    - The goose sees the feather and heads for the door. Corky blocks it with his whole body.

#### Complete `q38-complete`

**Fitz**: I’ve heard enough. Mostly Corky. The Nubbin is innocent. The goose is guilty. Goose, you’re barred.  
**Dabney** _(angry)_: You can’t bar a goose. It doesn’t come in through the door.  
**Corky** _(happy)_: We won! Bird law wins again! Undefeated! One and zero!  
**Dabney** _(angry)_: I demand an appeal. A higher court. A judge who isn’t wearing a mop.  
**Fitz**: Denied. There is no higher court. I’m the highest thing in this pub. Ask anyone.  
_Fitz bangs the bar with a wooden mallet, then hands it to you, because he’s bored now._  
_A gavel joins your decorations, and a “Nubbin Law” page appears in the Collection book, explaining trust, grades and alignment._  
_The goose leaves, still chewing._  

**Rewards**

- Gavel (decor): Fitz’s wooden mallet. Bang it on anything.
- Nubbin Law (feature): A Collection book page that explains trust, grades and alignment in plain terms.

**Notes:** Lead: Corky. The accused is the player’s own Fly-leaning Nubbin (fallback: the highest-Fly Nubbin they own). The three evidence pickups teach real systems: open its trust in the Collection book, inspect its alignment glow, search under the bar for the feather. The goose is the same smug goose as Q32 and is never harmed; “barred” is a joke, it can still wander the Grove. Fitz wears a mop-head wig.

## Q39. Project Badass

*It’s Always Sunny in Philadelphia: Mac’s Project Badass videos* · audience: adult · where: Outside Puddle’s Pub · when: A dry day after Q31; Rook is waiting with a list of stunts. Never during Chapters 9–11. · requires: Q31

**Cast:** Rook (Mac, It’s Always Sunny in Philadelphia), Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia)

### Step 1: Film Corky’s jump off the pub roof in Photo mode.

Hint: Stand by the hay cart and take the shot the moment Corky leaves the roof. · check: `photo:stunt:roof-jump`

#### Scene `q39-pitch`

**Rook** _(happy)_: Project Badass. A stunt reel. My stunts, my moves, my legend. You film it.  
_He hands you a list. Item one: JUMP OFF PUB ROOF INTO HAY CART._  
**Corky** _(happy)_: I’m the stunt guy. I don’t get paid. I get to be in it.  
**Rook**: You’re my double. You do the dangerous bit. I do the bit before and the bit after.  
**Corky**: What’s the bit before?  
**Rook**: I point at the roof and nod.  
_Rook points at the roof and nods. He holds it for some time._  
_Corky is already up there, waving. The hay cart is some distance from where he is standing._  

**Choices**

- **Push the hay cart under him.** — sets `{"q39-cart":"moved"}`
    - **Rook**: Don’t touch the set! That’s where the cart goes!
    - Rook pushes it back. Exactly where it was. Slightly further, if anything.
- **Just start filming.** — sets `{"q39-cart":"left"}`
    - **Rook**: A real director. Action!

#### Done `q39-roof-done`

_Corky jumps. He misses the hay cart. He does not miss the water butt._  
**Corky** _(happy)_: I’m fine! I hit the soft part of the barrel!  
**Rook**: Cut. Now get my reaction.  
_Rook gives a look of grim approval to nothing in particular._  

### Step 2: Film Corky going through the fence.

Hint: Frame the fence side-on; Corky bounces off the first time, so wait for the second run. · check: `photo:stunt:fence`

#### Scene `q39-fence-setup`

**Rook**: Stunt two. Through the fence. A man made of fists, bursting through wood.  
**Corky**: Are you gonna do it?  
**Rook**: I’m gonna do the pose. Through-the-fence is a stunt-double thing.  
**Mags** _(happy)_: I could do a stunt. I was a stunt actress for a week.  
**Rook**: You were an extra in a play about a duck, Mags. You were the duck.  
**Mags** _(angry)_: The duck was the lead!  
_Corky backs up, puts his head down and runs at the fence at full speed._  

#### Done `q39-fence-done`

_He bounces off. On the second run he goes through, and keeps going, into the nettles._  
**Corky** _(happy)_: Nettles! They don’t sting if you scream!  
_He screams. They sting._  
**Rook** _(happy)_: Beautiful. I’ll do a voiceover later saying that was me. In a deeper voice.  

### Step 3: Film the dive off the jetty, with a Swim Nubbin ready to tow Corky out.

Hint: Keep a Nubbin with good Swim near the jetty; it fishes Corky out once the shot is done. · check: `photo:stunt:pond-dive`

#### Scene `q39-jetty`

**Rook**: Final stunt. A flying kick off the jetty, into the pond, slow motion. The big finish.  
_Rook stands at the end of the jetty, does his best kick, then steps carefully back onto dry land._  
**Rook** _(happy)_: Great. Now Corky does the bit where you go in the water.  
**Corky**: I can’t swim, man.  
**Rook**: You don’t have to swim. You have to splash.  
_A Swim Nubbin bobs by the jetty, watching all this with open concern._  
**Rook** _(happy)_: And then the credits roll. Big letters. “All stunts performed by Rook.”  
**Corky** _(think)_: Is that me? Am I Rook in this? I’m confused about who I am in this.  

**Choices**

- **Tell Rook to credit Corky.** — sets `{"q39-credit":"corky"}`
    - **Rook**: Fine. Small. At the very end. In brackets.
    - **Corky**: Brackets! I’ve never been in brackets!
- **It’s Rook’s reel. Rook’s name goes on it.** — sets `{"q39-credit":"rook"}`
    - **Corky**: It’s cool. I know it was me. The barrel knows. The nettles know.
    - **Rook**: See? He gets it. A double doesn’t need credit. That’s what makes him a double.

#### Complete `q39-complete`

_Corky goes off the jetty like a bag of laundry. Your Nubbin tows him back by the collar, rather proudly._  
**Corky** _(happy)_: I nailed it. Did I nail it? I can’t feel my face.  
**Rook** _(happy)_: That’s a wrap on Project Badass. Every stunt done by me. In spirit.  
_Rook tears the sleeves off his karate gi so he can “breathe on camera”, and hands you the spare._  
**Rook**: And learn the pose. Every fighter needs a pose. This is the one I do before I don’t fight.  
_A sleeveless karate gi joins your wardrobe, and your Nubbins can strike a pose before every karate bout._  

**Rewards**

- Sleeveless Karate Gi (cosmetic): Rook’s spare gi, sleeves torn off for maximum arm.
- Pre-Bout Pose (cosmetic): Your Nubbin strikes a dramatic pose before each karate bout. No effect on the fight.

**Notes:** Lead: Rook. Corky takes every hit as cartoon slapstick: he always pops back up, no blood, no lasting injury. The Swim Nubbin only tows him out (no risk to it). Each stunt is a Photo mode target with a short window. Rook’s “bit before” is a held pose; play a long awkward silence before the narrator line. SFX: barrel thunk, fence crack, splash. q39-credit (corky / rook) can add “(Corky)” in tiny brackets to the reel’s end card.

## Q40. The Gang Goes to the Water Park

*It’s Always Sunny in Philadelphia: “The Gang Goes to the Water Park”* · audience: adult · where: The hill above the pond · when: A summer day after Q31; Mags is at the top of the hill with a pile of planks and a drawing. Never during Chapters 9–11. · requires: Q31

**Cast:** Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia)

### Step 1: Bring Mags 10 wood and 6 stone and build the waterslide.

Hint: Gather fallen branches in the woods and loose stones from the stream bed, then drop them on the pile at the hilltop. · check: `build:waterslide`

#### Scene `q40-plan`

**Mags** _(happy)_: Big news. I’m building a waterslide. From the top of the hill, into the pond. My idea. Mine.  
**Fitz**: My money.  
**Mags**: Fitz’s money. My idea.  
**Dabney**: It’s a terrible idea, which is why I’m here. I want to watch.  
**Corky**: Me and Dabney have a side thing. We’ll be back. Don’t ask what it is.  
**Dabney**: You’ll hear about it.  
_They wander off into the trees, whispering. Mags hands you a drawing. It is mostly arrows._  
**Mags**: I need wood for the chute and stone for the base. Lots. Go, go, go.  

**Choices**

- **Suggest a covered tube section, for speed.** — sets `{"q40-tube":"yours"}`
    - **Mags**: A tube! Yes! That’s what I was about to say!
    - **Fitz**: Tubes are expensive.
- **Suggest keeping it open, so people can get out.** — sets `{"q40-tube":"hers"}`
    - **Mags**: Boring. We’re doing a tube. I have vision.

#### Done `q40-build-done`

_The slide snakes down the hill, through a wooden tube, and into the pond. It wobbles. It is glorious._  
**Mags** _(happy)_: First go is mine. It’s my slide.  
**Fitz**: First go is mine. It’s my money.  
_They both get in at once._  

### Step 2: Get Fitz and Mags out of the waterslide tube.

Hint: Loosen the stones under the tube to tilt it, then pull; one side at a time, or the whole thing goes. · check: `minigame:unstick:waterslide`

#### Scene `q40-wedged`

_Halfway down, inside the tube, there is a thud. Then nothing. Then two voices._  
**Mags** _(angry)_: Get your elbow out of my ear!  
**Fitz**: That’s not my elbow, it’s a ham sandwich. I always bring one.  
**Mags** _(shock)_: Why is it wet?  
**Fitz**: It’s a waterslide, Mags.  
_Water is backing up behind them. The tube creaks._  
**Fitz**: Hurry up! She’s flapping about like a wet heron in a drainpipe!  
**Mags** _(angry)_: Get. Us. Out.  

**Choices**

- **Push from the top.** — sets `{"q40-rescue":"push"}`
    - You push. They move one inch. Fitz says “ow” in a voice muffled by sandwich.
- **Pull from the bottom.** — sets `{"q40-rescue":"pull"}`
    - **Mags**: Pull my leg! Not that one! That’s Fitz! Pull MY leg!

#### Done `q40-stuck-done`

_They shoot out of the tube together with a noise like a cork and land in the pond in one tangle._  
_Corky and Dabney come back from the trees with a sack of shells and a sign: SLIDE, 5 SHELLS._  
**Dabney** _(happy)_: We sold tickets. Every one we printed. For a slide that, until a minute ago, didn’t work.  
**Corky** _(happy)_: We didn’t know that! It’s not a lie if you don’t know!  
_At the bottom of the hill, a long queue of damp neighbours and their Nubbins is holding tickets and looking up at you._  

**Choices**

- **Make them give the shells back.** — sets `{"q40-tickets":"refund"}`
    - **Dabney**: Refund? The slide works now. It’s a scam that came true. That’s just a business.
    - Corky hands the shells back one at a time, counting out loud, wrongly, in everybody’s favour.
- **Let the ticket holders ride. It works now.** — sets `{"q40-tickets":"honour"}`
    - The queue climbs the hill. The slide holds. Somehow, it holds.
    - **Dabney**: So the lie just… became true. I could get used to that.
- **Ask for your cut.** — sets `{"q40-tickets":"cut"}`
    - **Dabney**: Now you’re thinking like one of us.
    - **Corky**: Here. One shell. That’s your cut. Don’t spend it all on one thing.

#### Complete `q40-complete`

**Mags** _(angry)_: You sold tickets? To my slide? Where’s my cut?  
**Dabney**: Your cut is that you got out of the tube, Mags.  
**Fitz**: Where’s my cut? It’s my money.  
**Corky**: We spent it. On more tickets.  
_A Nubbin climbs the hill, sits at the top of the slide and whooshes into the pond. It runs straight back up for another go._  
_The waterslide is yours. Nubbins slide down it for fun, and it nudges them towards Swim._  

**Rewards**

- Waterslide (decor): A wobbly slide from the hilltop into the pond. Nubbins ride it for fun, which gives them a small lean towards Swim.

**Notes:** Lead: Mags. The tube gets built whichever choice the player makes (Mags always overrules); the flag only records who suggested it. Corky and Dabney are off-screen during step 2. Unstick minigame: tilt and pull with water rising behind the stuck pair; failure just resets with a gush of water. No Nubbins go in the slide until it is fixed. q40-tickets (refund / honour / cut) is flavour; “cut” gives 1 shell.

## Q41. The Gang Wrestles for the Troops

*It’s Always Sunny in Philadelphia: “The Gang Wrestles for the Troops”* · audience: adult · where: The dojo · when: After Q31 and your first karate win; a poster at the dojo announces wrestling night. Never during Chapters 9–11. · requires: Q31

**Cast:** Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Rook (Mac, It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia)

### Step 1: Choose a Nubbin as your tag partner and enter the ring at the dojo.

Hint: Open the karate menu at the dojo and choose Tag Team; a Nubbin with good Stamina helps, the match runs long. · check: `karate:enter:tag-team`

#### Scene `q41-ring`

_The dojo has a wrestling ring in it now. The ropes are washing lines. A sign: WRESTLING NIGHT, FOR THE GROVE WATCH._  
**Mags** _(happy)_: Keepers and Nubbins! Our first wrestler comes from a place of darkness and smells!  
_A bin in the corner of the ring wobbles. The lid lifts. Fitz rises out of it, covered in peel._  
**Fitz** _(happy)_: Trash Man!  
_He picks a fish skeleton off his shoulder and eats what’s left on it. The crowd screams. Some of it is cheering._  
**Rook** _(happy)_: And his opponents! The tag team! Feathers and Fury!  
_Rook and Dabney climb in wearing matching capes covered in glued-on feathers. Dabney has also oiled himself._  
**Dabney** _(happy)_: The crowd adores us. Look at their faces. That’s adoration.  
**Corky**: That’s fear, Dabney. I’m the ref. I can tell.  
**Fitz**: Trash Man needs a partner. You. And bring a Nubbin. A tough one.  

**Choices**

- **Climb into the bin with Fitz for your entrance.** — sets `{"q41-entrance":"bin"}`
    - It is warm in the bin. Something else in the bin is also warm. You do not investigate.
    - **Fitz**: That’s my partner!
- **Use the steps like a normal person.** — sets `{"q41-entrance":"steps"}`
    - **Fitz**: Boo! Boo! The Trash Man’s partner uses steps!

#### Done `q41-debut-done`

**Corky**: Okay. Rules. No biting. Some biting. Biting’s fine. Ding ding.  
_Corky hits the bell with a frying pan._  

### Step 2: Win the tag-team bout against Feathers and Fury.

Hint: Swap between your two fighters when the bar flashes; the fresh one hits harder. · check: `karate:win:tag-team-feathers`

#### Scene `q41-bout`

_Feathers and Fury open with a pose that takes thirty seconds. Feathers come off in every direction._  
**Rook** _(angry)_: Hi-YAH! Flying Feather Kick!  
_Rook leaps off the ropes, misses everyone and lands in Fitz’s bin. The lid shuts on him._  
**Dabney** _(angry)_: Rook! You’re ruining our look!  
**Fitz**: Tag in the Nubbin! Let the little one do the work!  
_Your Nubbin hops over the rope, stands very still, and waits. Dabney looks at it. It looks at Dabney._  
**Dabney** _(shock)_: Why is it calm? Why is it so calm?  
_In a clinch by the ropes, Dabney leans in close. He smells of oil and confidence._  
**Dabney**: Keeper. Lie down in round two and we split the gate money. Fitz never has to know.  

**Choices**

- **Refuse. Wrestle it clean.** — sets `{"q41-deal":"refused"}`
    - **Dabney**: Clean? In a ring made of washing lines? With him?
- **Agree. Then win anyway.** — sets `{"q41-deal":"double-crossed"}`
    - **Dabney**: Pleasure doing busi—
    - Your Nubbin is already tagged in. Dabney’s face does something complicated.
- **Tell Fitz.** — sets `{"q41-deal":"told"}`
    - **Fitz**: He offered you a split? He never offered ME a split!
    - Fitz is not upset about the cheating. Fitz is upset about being left out of it.

#### Complete `q41-complete`

_Dabney slips on his own oil and leaves the ring backwards. The referee, who is eating crisps, declares a winner._  
**Corky** _(happy)_: Winner! The trash team! And the Nubbin! Mostly the Nubbin!  
**Fitz** _(happy)_: Trash Man!  
**Rook** _(sad)_: Can someone open the bin? I’m still in the bin.  
**Mags** _(happy)_: And every shell from tonight goes to the Grove Watch!  
**Fitz**: Most of the shells. Some shells. A shell. Take the costumes. Feathers, peel, the lot. The smell’s free.  
_The wrestling costumes join your wardrobe. In karate, two of your Nubbins can now share a bout as a tag team._  

**Rewards**

- Tag-Team Karate (feature): Two of your Nubbins can share one karate bout, swapping in and out.
- Wrestling Costumes (cosmetic): The Trash Man’s peel-covered vest and a feathered Feathers and Fury cape.

**Notes:** Lead: Fitz. The quest bout is a scripted tag-team karate bout against Rook and Dabney (use the karate UI with their portraits); no person ever strikes a Nubbin: Rook lands in the bin and Dabney slips on his own oil. Trash Man entrance: bin lid lift, peel particles, crowd scream. Fitz eats from the bin on screen (gross-out is fine, keep it a quick gag). Dabney’s offer to throw the bout is a flavour choice (q41-deal); the step is still won in the karate UI.

## Q42. Pepe Silvia

*It’s Always Sunny in Philadelphia: “Sweet Dee Has a Heart Attack” (the mail room)* · audience: adult · where: Puddle’s Pub, back room · when: After Q31, once a pear has been left at your gate three mornings running. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia)

### Step 1: Follow Corky’s red string to three clues around the Grove.

Hint: The strings run from the pub to the pear tree, the stream bank and the pub bins; inspect the end of each one. · check: `find:clue:pepe-silvia:3`

#### Scene `q42-wall`

_For three mornings running, someone has left a pear at your gate. Corky has noticed. Corky has done something about it._  
_The back room is covered, floor to ceiling, in notes, string and pinned-up pear stalks. Corky is sweating through his shirt._  
**Corky** _(shock)_: Pepe Silvia!  
**You**: Who?  
**Corky**: That’s the name. On the pears. Every pear comes with a mark, and every mark is him. Pepe Silvia.  
**Dabney**: Corky, that mark is where the stalk was. And you can’t read.  
**Corky** _(angry)_: I don’t have to read, Dabney, I have to SEE! And I see him everywhere!  
**Corky**: I’ve been working the mail room. Nobody else does the mail room. It’s just me and the mail.  
**Dabney**: There is no mail room. It’s a shoebox by the door.  
**Corky** _(think)_: Follow the string. The tree. The stream. The bins. I’ve got string on all of them.  

**Choices**

- **Tell Corky you believe him.** — sets `{"q42-believe":true}`
    - **Corky**: Finally! Someone gets it! You’re in the circle now. There’s string in it for you.
- **Ask him when he last slept.** — sets `{"q42-believe":false}`
    - **Corky**: Sleep is what he WANTS, man!

#### Done `q42-clues-done`

_Clue one: tiny nibble marks on a pear branch. Clue two: small round prints in the mud. Clue three: a very neat core in the bins._  
**Corky** _(shock)_: Small teeth. Small feet. Tidy. This is a professional.  
**Dabney**: Or a Nubbin.  
**Corky**: Don’t be stupid, Dabney.  

### Step 2: Stake out your gate at dawn and catch whoever is leaving the pears.

Hint: Hide by the hedge before sunrise and stay still; move too early and whoever it is runs off. · check: `wait:gate:dawn`

#### Scene `q42-hedge`

**Corky**: We stake out the gate. Tonight. All night. I’ve got snacks. I’ve got a lantern. I’ve got string, in case.  
_You crouch behind the hedge with Corky. He has brought a jar of something that smells like glue, “to stay sharp”._  
**Corky** _(think)_: And another thing. I asked HR. I went straight to HR and asked for Carol.  
**Dabney**: Corky, we don’t have—  
**Corky** _(angry)_: There is no Carol in HR!  
**Dabney**: We don’t have an HR. There has never been a Carol. You made Carol up on Tuesday.  
**Corky**: Exactly. Exactly! Think about it!  
_At three in the morning, Corky whispers “Pepe Silvia” into the hedge, to see if it flinches. It does not._  
_Just before dawn, something small rustles at the gate._  

#### Complete `q42-complete`

_One of your own Nubbins waddles up to the gate with a pear in its arms, sets it down neatly, and looks very proud._  
**Corky** _(shock)_: Pepe Silvia!  
_The Nubbin looks at Corky. Corky looks at the Nubbin. The Nubbin hands him the pear._  
**Corky** _(soft)_: It’s been gifts. The whole time. It’s been bringing you gifts.  
**Dabney**: It likes you, Keeper. That’s all this ever was.  
**Corky** _(happy)_: I’m keeping the wall. The wall was right, it was just right about different stuff.  
_Corky gives you the conspiracy board anyway, string and all. A red-string conspiracy board joins your decorations._  

**Rewards**

- Red-String Conspiracy Board (decor): Corky’s wall of notes, pear stalks and red string. It explains everything, if you don’t look closely.

**Notes:** Lead: Corky. The gift-giver is the player’s highest-trust Nubbin; for the three mornings before the trigger, spawn a pear at the gate and have that Nubbin path there at dawn. Clue spots are marked by red string running from the pub. The “mark” on the pears is just the stalk scar; Corky cannot read and sees a name. Art: back-room wall covered in string; Corky sweat-stain shirt variant.

## Q43. Lethal Weapon 5

*It’s Always Sunny in Philadelphia: the gang’s home-made Lethal Weapon sequels* · audience: adult · where: The woods by the old mill · when: After Q31; Fitz has bought a crate of fireworks and Rook a leather jacket. Never during Chapters 9–11. · requires: Q31

**Cast:** Rook (Mac, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia)

### Step 1: Direct scene one: film the wheelbarrow chase in Photo mode.

Hint: Track Rook as Corky pushes the wheelbarrow down the hill; shoot when the painted headlights face you. · check: `photo:scene:lethal-weapon-5:chase`

#### Scene `q43-setup`

_Fitz has bought a crate of fireworks. Rook has bought a leather jacket two sizes too small. Together, they are making a film._  
**Rook** _(happy)_: Lethal Weapon 5. The one nobody made. Because they were scared.  
**Fitz**: I’m the director. And the money. And the old cop who’s too old for all this.  
**Rook**: I’m the young cop. Loose cannon. Plays by his own rules. Has abs.  
**Mags**: And me?  
**Fitz**: You’re a body in the river.  
**Mags** _(angry)_: A dead body? I can act! I’ve got range!  
**Dabney**: You’ll be perfect, Mags. Just lie still and look like a wet egret.  
**Rook**: Keeper, you’re on camera. Nubbins are the extras. Scene one: the car chase.  
_There is no car. There is a wheelbarrow with two headlights painted on it, and Corky, ready to push._  

**Choices**

- **Seat the Nubbin extras well back from the fireworks.** — sets `{"q43-extras":"back"}`
    - **Fitz**: Fine. Ruin my shot. Safety is for cowards.
    - The Nubbins sit in a neat row on the hill, delighted to be in a film.
- **Give the Nubbin extras a job: cheering.** — sets `{"q43-extras":"cheering"}`
    - **Rook**: A crowd! Every hero needs a crowd!
    - The Nubbins cheer from the hill, well clear of anything that might go bang.

#### Done `q43-chase-done`

_Corky pushes the wheelbarrow down the hill at full speed. Rook stands in it, pointing a stick. They hit a hedge._  
**Rook** _(happy)_: Cut! Print it! That’s the movie!  

### Step 2: Direct scene two: film the shed explosion from a safe distance.

Hint: Stay at the camera spot on the hill with the Nubbins; zoom in, don’t walk in. · check: `photo:scene:lethal-weapon-5:explosion`

#### Scene `q43-shed`

**Fitz** _(happy)_: Scene two. The big bang. The bad guys’ hideout goes up in a ball of fire.  
_The bad guys’ hideout is a garden shed. Fitz has packed it with every firework he owns._  
**Dabney**: Is this safe?  
**Fitz**: No.  
**Rook**: I walk away from the explosion without looking back. Cool guys don’t look at explosions.  
_Fitz lights the fuse. Rook walks away. Rook looks back. Rook runs._  
_Far up the hill, the Nubbins ooh at the sparks._  
_Down in the stream, Mags floats slowly past the shed, face down, still fully in character._  

#### Done `q43-explosion-done`

_The shed does not explode. It fizzes, spins, whistles, and fires a single rocket straight into the pub sign._  
**Fitz** _(happy)_: Beautiful. Very realistic. Keep rolling.  

### Step 3: Direct scene three: film the fight on the bridge.

Hint: Shoot from the bank so the whole bridge fits in frame; the fight is short and mostly falling. · check: `photo:scene:lethal-weapon-5:bridge`

#### Scene `q43-showdown`

**Rook**: Final scene. The fight on the bridge. Me against the villain. Dabney, you’re the villain.  
**Dabney** _(happy)_: Obviously. Villains are the clever ones. And the best dressed.  
**Mags** _(angry)_: I’ve been lying in the stream for an hour. Can the body have a line? One line?  
**Fitz**: Bodies don’t talk.  
**Mags**: This one does! This one has things to say!  
_Rook and Dabney circle each other on the bridge. Rook strikes a karate pose. Dabney adjusts his collar._  

**Choices**

- **Give Mags her line.** — sets `{"q43-mags":"line"}`
    - **Mags**: I’m alive! And I know who did it! It was—
    - Rook falls off the bridge on top of her. Print.
- **Keep Mags dead.** — sets `{"q43-mags":"dead"}`
    - **Mags**: Fine! I’ll be the best corpse this Grove has ever seen!
    - She is, honestly, very good at it.

#### Complete `q43-complete`

_The fight lasts four seconds. Both men fall into the stream. Mags is landed on twice._  
**Fitz** _(happy)_: That’s a wrap! Best one yet. Better than four.  
**Rook**: We never made four.  
**Fitz**: Then it’s definitely better than four.  
_Fitz shows you how to keep the camera rolling instead of taking one picture. He breaks it twice doing so._  
_Movie mode is now part of Photo mode: record a short clip and save it._  

**Rewards**

- Movie Mode (feature): A new Photo mode option: record a short clip of your Grove and save it.

**Notes:** Lead: Rook (with Fitz). Corky appears without lines, pushing the wheelbarrow. Keep it a generic no-budget action film: no costumes, make-up or impressions of real people. Nubbin extras always sit on the hill, well away from the fireworks; the shed only fizzes and one rocket hits the pub sign (sign gets a scorch mark afterwards). Each scene is a Photo mode target; Movie mode unlocks at the end.

## Q44. Milk Steak

*It’s Always Sunny in Philadelphia: Charlie’s favourite foods* · audience: adult · where: The Gilded Pear, a restaurant down the valley · when: After Q31; Corky leaves a drawing of a cow and a fork at your gate. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Mr Tallis

### Step 1: Meet Corky at The Gilded Pear in the valley, dressed for dinner.

Hint: Change into any outfit from your wardrobe, then walk down the valley past the bridge to the restaurant. · check: `visit:place:gilded-pear`

#### Scene `q44-drawing`

_There is a drawing at your gate. A cow. A fork. An arrow pointing down the valley. Corky has signed it with a thumb._  
**Corky** _(happy)_: You came! I booked us a table. The fanciest place in the valley. The Gilded Pear.  
_He is wearing a suit jacket over his work overalls, and a tie made from a sock._  
**Corky**: I save all year. I eat here once, on my birthday. Which is today. Right now.  
**Corky**: You gotta look nice. They don’t let you in if you look like me. Well, they do now. They know me.  
**Corky** _(think)_: And you let me order. I know the good stuff. The stuff that’s not on the menu.  

**Choices**

- **Put on your smartest outfit.** — sets `{"q44-outfit":"smart"}`
    - **Corky**: Ooh, look at you. Like a prince. A prince of soup.
- **Match Corky: overalls and a sock tie.** — sets `{"q44-outfit":"sock"}`
    - **Corky**: Twins! We’re twins! They’re gonna love this!

#### Done `q44-arrive`

**Mr Tallis**: Good evening. Ah. Mr Corky. Again.  
**Corky** _(happy)_: Table for two, my man. By the window. So people can see me.  
_While Corky fights his chair, Mr Tallis bends to your ear._  
**Mr Tallis**: (quietly) I could bring you the trout. He need never know. I have a family. I have seen the milk steak.  

**Choices**

- **“I’ll have whatever he’s having.”** — sets `{"q44-order":"milk"}`
    - **Corky**: You hear that, Tallis? Two! It’s a birthday for two!
    - Mr Tallis closes his eyes for slightly longer than a blink.
- **Quietly ask for the trout.** — sets `{"q44-order":"trout"}`
    - **Corky**: Trout? On my birthday?
    - **Corky**: No, it’s cool. It’s cool. You’ll want a bite of mine. Everybody always wants a bite of mine.
    - **Mr Tallis**: The kitchen has heard Mr Corky’s voice. The kitchen is frightened. It will be milk steak.

### Step 2: Finish the milk steak without leaving the table.

Hint: Eat in small bites and sip water between them; if the queasy meter fills, you bolt for the door and start again. · check: `minigame:eat:milk-steak`

#### Scene `q44-order`

**Mr Tallis**: Tonight we have a lovely trout, a pear tart, and a soup of the—  
**Corky**: No. No. We’re having the milk steak.  
**Mr Tallis** _(think)_: Sir, we do not have a milk steak.  
**Corky**: You do. Get a steak. Put it in milk. Boil it a long time, till it goes grey and gives up.  
**Corky** _(happy)_: And jelly beans on the side. Raw. Don’t cook ’em. Don’t let anyone touch ’em.  
_The waiter looks at you with a silent plea. You say nothing. He leaves._  
_Twenty minutes later, two grey slabs arrive, steaming, in a skin of milk. The jelly beans come in a gravy boat._  
**Corky** _(happy)_: Look at that. LOOK at that. That’s a meal. That’s a birthday.  
_Corky finishes his in four bites. Then he looks at your plate. Then at you._  
**Corky**: You gotta finish it. Leave food at a place like this and they never let you back.  

**Choices**

- **Dip every bite in the jelly beans.** — sets `{"q44-method":"beans"}`
    - **Corky**: You get it! Sweet and meaty! Meaty and sweet!
    - It is neither of those things.
- **Hold your nose and swallow.** — sets `{"q44-method":"nose"}`
    - You hold your nose. It turns out the taste was never in your nose.
- **Try to slip a piece onto Corky’s plate.** — sets `{"q44-method":"slip"}`
    - **Corky**: Hey, no. That’s yours. That’s a gift. You don’t give back a gift.

#### Complete `q44-complete`

_You finish. Every bite. Every bean. The waiter brings the bill on a plate, held at arm’s length._  
**Corky** _(happy)_: You did it! Nobody finishes! Dabney cried. Fitz finished, but he eats napkins.  
**Corky** _(soft)_: Best birthday ever. Thanks for coming, man. Nobody comes.  
_He pays in coins from a jam jar and wraps the leftovers in his sock tie._  
**Corky**: Take some for the little guys. Fills ’em right up. They hate it, but it fills ’em up.  
_Milk steak joins your items: a huge, grim meal that fills a Nubbin’s hunger completely. You keep the napkin bib._  

**Rewards**

- Milk Steak (item): A grey steak boiled in milk. Fills a Nubbin’s hunger completely; it eats it with a visible shudder.
- Napkin Bib (cosmetic): A starched restaurant napkin, tucked in at the collar. Splattered.

**Notes:** Lead: Corky. Corky’s order is in his own words (not the show’s). q44-order (milk / trout) is flavour: the kitchen serves milk steak either way. Eating minigame: tap to bite, a queasy meter rises per bite and falls with water; full meter = run outside, retry. Feeding milk steak to a Nubbin plays a shudder then a contented full-belly idle; no harm, no stat penalty. Art: two grey steaks in milk skin, jelly beans in a gravy boat, Corky’s sock tie.

## Q45. The Gang Goes Bowling

*It’s Always Sunny in Philadelphia: “The Gang Goes Bowling”* · audience: adult · where: Puddle’s Pub, by the stream · when: After Q31; a team of rival Keepers from Highbank walks in with a challenge. Never during Chapters 9–11. · requires: Q31

**Cast:** Corky (Charlie Kelly (Charlie Day), It’s Always Sunny in Philadelphia), Dabney (Dennis Reynolds, It’s Always Sunny in Philadelphia), Mags (Dee Reynolds, It’s Always Sunny in Philadelphia), Rook (Mac, It’s Always Sunny in Philadelphia), Fitz (Frank Reynolds, It’s Always Sunny in Philadelphia), Pim Ashdown

### Step 1: Build a practice lane behind the pub and knock down all twelve pins in one roll.

Hint: Lay flat planks in a line, stand the twelve pins at the end, and roll the melon gently with a slight curve. · check: `minigame:bowling:strike`

#### Scene `q45-challenge`

_A team of Keepers from Highbank walks into the pub in matching shirts. Their captain slaps a challenge on the bar._  
**Pim Ashdown**: Pim Ashdown, Highbank. We heard you lot think you can bowl. We think you can’t.  
**Corky** _(happy)_: We can bowl. We’re great at bowling. Dabney, what’s bowling?  
**Dabney**: Rolling a thing at some other things, Corky.  
**Corky** _(happy)_: We’re great at that!  
**Fitz** _(happy)_: What are we betting? Bet the pub. Put the pub on it.  
**Dabney** _(shock)_: You can’t bet the pub, Fitz.  
**Fitz**: I own the pub. I can bet what I like. I once bet a kidney. Not mine.  
**Pim Ashdown**: Done. Your pub against our boat. Tomorrow. Twelve pins, and we bring the ball.  
_Their ball is a melon. Nobody questions this._  
**Mags**: Keeper, we need a lane. And practice. And possibly a different team.  

**Choices**

- **Talk trash right back at Pim.** — sets `{"q45-talk":"trash"}`
    - **Corky**: Ooooh! You hear that? They heard that!
    - **Pim Ashdown**: Cute. Bring a mop for afterwards.
- **Shake Pim’s hand politely.** — sets `{"q45-talk":"polite"}`
    - **Rook**: Don’t shake the hand! Never shake the hand! It’s a sign of weakness!

#### Done `q45-practice-done`

_On your fortieth try, every pin goes down. Corky, who was standing behind them, also goes down._  
**Corky** _(happy)_: Strike! And me! Two strikes!  

### Step 2: Win the bowling match against Highbank.

Hint: You bowl the last three frames; aim for the centre pin and let the melon curve. The trash talk is timed to put you off. · check: `minigame:bowling:win:highbank`

#### Scene `q45-lanes`

_Match day. Half the Grove is behind the pub. The Highbank team warms up in silence, like professionals._  
**Pim Ashdown**: Your shirts are stained.  
**Dabney** _(happy)_: They’re vintage. Like my contempt for you.  
**Mags**: You bowl like a cow trying to sit on a stool.  
**Pim Ashdown**: Says the woman built like a heron on stilts.  
**Mags** _(angry)_: I am NOT a bird!  
**Rook**: Rook bowls first. Rook always bowls first. A kata before every roll, to scare them.  
_Rook does a kata. It takes four minutes. He rolls straight into the gutter._  
**Corky** _(think)_: It’s on you and me, Keeper. If we lose, Fitz sells the pub, and I live in the pub.  
_Between frames, you see Fitz press a fat bag of shells into Pim’s hand and wink._  
**Fitz** _(happy)_: It’s called a hedge. Rich people do it. Whoever wins, I win.  

**Choices**

- **Tell the whole gang.** — sets `{"q45-hedge":"exposed"}`
    - **Dabney**: You bet against us?
    - **Fitz**: I bet against Rook. Everybody bets against Rook.
    - **Rook**: That’s… fair, actually.
- **Say nothing. Win, and let him lose.** — sets `{"q45-hedge":"quiet"}`
    - **Corky**: Ooh, that’s mean. I love it. Roll it, Keeper.
- **Tell Fitz to move his bet onto you.** — sets `{"q45-hedge":"doubled"}`
    - **Fitz**: On you? I’ve watched you bowl forty times. I saw thirty-nine of them.
    - He moves the bet anyway. He sweats through every frame that follows.

#### Complete `q45-complete`

_The melon curves, wobbles, and takes out all twelve pins in a spray of seeds._  
**Corky** _(happy)_: We won! We kept the pub! I still live in the pub!  
**Pim Ashdown** _(angry)_: Rematch. Next season. Bring a real ball.  
**Fitz** _(happy)_: And we won a boat! Who wants a boat? I’m selling it. Tonight.  
**Dabney**: The lane stays. We’re bowlers now. It’s part of my brand.  
_Corky hands you a shirt with someone else’s name stitched on it. The lane stays behind the pub for anyone to play._  
_A bowling lane joins your decorations, playable any time, and a bowling shirt joins your wardrobe._  

**Rewards**

- Bowling Lane (decor): A plank lane with twelve wooden pins and a melon. Play it any time.
- Bowling Shirt (cosmetic): A stained bowling shirt with someone else’s name on the pocket.

**Notes:** Lead: Corky. Bowling minigame: aim line + curve, twelve pins in a triangle, the ball is a melon (seed splash on a strike). In the match the gang bowls automatically (badly) and the player bowls the last three frames; Pim’s trash talk pops up as barks during the run-up. The boat is flavour only; Fitz sells it off-screen. The pub is never actually at risk: losing just restarts the match. q45-hedge (exposed / quiet / doubled) records what you did about Fitz betting on Highbank.
