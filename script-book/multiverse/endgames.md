# Multiverse: Endgames (E1–E6)

## E1. Civil War

*Civil War #1–7; epilogues from The Death of Captain America and Captain America: Reborn* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Once every Iron Man and Captain America storyline is finished. The rift opens on a sunny street in Stamford. · requires: IM1, IM2, IM3, IM4, IM5, IM6, IM7, IM8, IM9, IM10, IM11, IM12, IM13, IM14, IM15, CA1, CA2, CA3, CA4, CA5, CA6, CA7, CA8, CA9, CA10

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Steve Rogers (Steve Rogers, Captain America (Marvel Comics)), Miriam Sharpe (Miriam Sharpe, a mother who lost her son at Stamford (Civil War #1)), Maria Hill (Maria Hill, director of S.H.I.E.L.D. (Marvel Comics)), Peter Parker (Peter Parker, Spider-Man (Marvel Comics)), Reed Richards (Reed Richards, Mister Fantastic (Marvel Comics)), Bill Foster (Bill Foster, Goliath (Marvel Comics)), Thor? (Ragnarok, the cloned Thor built during Civil War (Marvel Comics)), Sam Wilson (Sam Wilson, the Falcon (Marvel Comics)), Luke Cage (Luke Cage (Marvel Comics)), Frank Castle (Frank Castle, the Punisher (Marvel Comics)), Sharon Carter (Sharon Carter, Agent 13 (Marvel Comics)), Kobik (Kobik, the Cosmic Cube as a child (Marvel Comics))

### Step 1: Dig through the wreckage at Stamford with your Nubbins.

Hint: An expedition with no enemies. Small Nubbins fit where rescuers can’t; keep their stamina up and rotate them. · check: `expedition:clear:mv-stamford-wreck`

#### <a id="mv-e1-stamford"></a>Scene `mv-e1-stamford`

_The rift opens on a sunny street in Stamford, Connecticut. A camera crew is filming four young heroes outside a house._  
_They have a reality show. They need a big finish for the season. Inside the house are four wanted villains._  
_A girl with a clipboard waves you out of the shot. Your Nubbins wave back. She sighs and calls for another take._  
_Across the road is an elementary school. It is lunch break. The yard is full of children._  
_The young heroes kick the door in. One of the villains is called Nitro. He comes out through the wall, glowing._  
_Your Fly Nubbin sees it first. It goes rigid in the air and stops flapping._  
_Then the whole street turns white._  
_When the sound comes back there is no house. There is no school. There is a crater, and a long, slow cloud._  
_Sirens start, far away, and for a long time they get no closer._  
**Tony Stark** _(sad)_: I came as fast as I could. It wasn’t fast enough. It’s never fast enough.  
**Tony Stark**: Keeper. Your Nubbins are small. They can get into places my suits can’t. Please.  

#### <a id="mv-e1-stamford-done"></a>Done `mv-e1-stamford-done`

_Your Nubbins come out of the rubble with a backpack with a cartoon dog on it. They set it down by Tony and sit beside it._  
_Days later, at the funeral, a woman walks straight through the crowd to Tony._  
**Miriam Sharpe** _(angry)_: My son was in that school. You people fight on television for fun, and nobody ever checks on any of you.  
**Miriam Sharpe**: You paid for your suit yourself. Who did you answer to? Who answers for my boy?  
_She leaves. Tony doesn’t move for a long time._  

### Step 2: Decide whether your Nubbins register or go into hiding.

Hint: Talk to Tony and Steve. Your choice decides the next chapters, and who stands with you at the very end. · check: `choose:mv-cw`

#### <a id="mv-e1-act"></a>Scene `mv-e1-act`

_Washington passes the Superhuman Registration Act in a week. Every masked hero must unmask, sign up, and take orders._  
_A clause is added late one night: powered creatures from beyond the rift must be registered too. Your Nubbins get forms._  
**Tony Stark** _(think)_: I helped write it. I know how it sounds. Imagine how it would sound if somebody worse had written it.  
**Tony Stark**: People wanted us gone. Registration is the deal that keeps us here: trained, licensed, answerable.  
_On a S.H.I.E.L.D. helicarrier, Maria Hill asks Steve Rogers to lead the hunt for heroes who won’t sign._  
**Maria Hill**: You’ll bring them in, Captain. That’s an order from the people you work for.  
**Steve Rogers** _(angry)_: I work for the people. That isn’t the same as whoever’s standing in this room.  
_Twenty agents raise their guns. Steve goes out of the window instead._  
_That night the forms arrive: a photo slot, a box for a home address, a line for a thumbprint. Your Nubbins don’t have thumbs._  
**Steve Rogers** _(sad)_: They’ll give your little ones numbers, Keeper. Then pens. I’ve seen where lists of names end up.  
**Tony Stark**: It’s a form, Steve. A form and a training course. Nobody is building pens.  
_Both of them look at you. Your Nubbins look at the forms._  

**Choices**

- **Sign the forms. Stand with Tony.** — sets `{"mv-cw":"registration"}`
    - **Tony Stark**: Thank you. Really. It’s easier to fix a thing from the inside.
    - Your Nubbins get small laminated badges. One of them eats a corner off its badge.
    - **Tony Stark**: That’s a federal document.
    - It was the corner with the number on. Your Nubbin is, technically, unregistered again, and very pleased about it.
- **Tear up the forms. Go with Steve.** — sets `{"mv-cw":"resistance"}`
    - **Steve Rogers**: Then we move tonight. Pack light. Nobody sleeps much where we’re going.
    - Your Nubbins climb into a duffel bag without being asked. They have always liked bags.

#### <a id="mv-e1-act-done"></a>Done `mv-e1-act-done`

_Tony and Steve meet once more, on a rooftop, without their masks._  
**Steve Rogers**: You used to be the one who fought the people telling us what to do.  
**Tony Stark** _(angry)_: I grew up. You should try it.  
_They walk away in opposite directions. Neither of them looks back._  

### Step 3: Stand beside Peter Parker at the press conference.

Hint: Registration side only. Keep your Nubbins calm on the stage; the camera flashes frighten them. · check: `talk:mv-peter-parker`

#### <a id="mv-e1-unmask"></a>Scene `mv-e1-unmask`

_Tony’s side has a headquarters, a budget and a press office. Your Nubbins get a room with a window and a fruit bowl._  
_Tony has made Peter Parker a new suit: red and gold, full of gadgets, and fitted with a few things Peter hasn’t found yet._  
**Peter Parker** _(happy)_: He built me a suit. Nobody builds me things. My aunt knits. That’s about it.  
**Tony Stark**: Today we show the country we mean it. One hero unmasks on live television. I need it to be you, Peter.  
**Peter Parker** _(shock)_: Me? I’ve kept this face secret since high school.  
**Tony Stark**: That’s exactly why. If you can do it, anyone can.  
_Backstage, Peter sits on a cardboard box with your Nubbins. He takes the mask off, then puts it back on, then off again._  
**Peter Parker** _(sad)_: My aunt’s in this. My wife. Every creep I ever stuck to a lamppost will know where they sleep.  
**Peter Parker** _(think)_: But he’s right, isn’t he? If we want people to trust us, we have to show them who we are.  
_Somebody calls “two minutes”. The studio lights come up. Your Nubbins blink._  

**Choices**

- **“You don’t have to do this, Peter.”** — sets `{"mv-e1-peter":"peter-doubted"}`
    - **Peter Parker**: I know. That’s the scary part. I’m choosing it.
- **“We’ll be right there on the stage with you.”** — sets `{"mv-e1-peter":"peter-stood"}`
    - **Peter Parker**: With the little guys? Okay. Okay. Nobody can be scared next to those.

#### <a id="mv-e1-unmask-done"></a>Done `mv-e1-unmask-done`

_Peter walks to the podium and takes off his mask. Every camera in the world flashes at once._  
**Peter Parker**: My name is Peter Parker. I’ve been Spider-Man since I was fifteen.  
_Your Nubbins clap. For a second nobody else in the room does. Then everybody does._  

### Step 4: Hold the line in Tony’s ambush until the clone is called off.

Hint: Registration side only. A survival bout: your Nubbins only have to stay on their feet. · check: `karate:survive:mv-cw-ambush`

#### <a id="mv-e1-ambush"></a>Scene `mv-e1-ambush`

_Tony fakes a chemical-plant fire to draw the rebels out. Steve’s team arrives to put it out. Tony’s team is waiting for them._  
**Tony Stark**: Steve. It doesn’t have to be a fight. Sign, and we all go home.  
**Steve Rogers**: Home’s where your people are taking my friends in handcuffs, Tony.  
_The sky goes dark. Thor comes down with his hammer. Everybody stops. Thor has been gone for a year._  
**Reed Richards** _(think)_: It isn’t Thor. Tony and I grew it from a hair. It has his strength. It does not have his judgement.  
**Thor?**: Kneel, or be broken.  
_Bill Foster, Goliath, grows to sixty feet and steps between the clone and the smaller heroes._  
**Bill Foster**: I’ve been a giant longer than that thing’s been alive. Go on. Everybody run.  
_The clone swings once. Lightning goes through Bill Foster. He falls, and he does not get up._  
_Every hero on the field, on both sides, goes completely still. Your Nubbins run to him anyway._  
**Peter Parker** _(shock)_: He’s not breathing. Tony. Tony, he’s not breathing.  
**Tony Stark** _(shock)_: That wasn’t supposed to happen. That was not supposed to happen.  
**Reed Richards** _(think)_: Its control code is on my tablet. I can end it now. Or we keep it, and learn exactly what went wrong.  

**Choices**

- **“Shut it down. Now.”** — sets `{"mv-e1-clone":"shutdown"}`
    - Reed taps once. The thing with Thor’s face folds to the ground like a coat with nobody in it.
    - **Tony Stark**: Log it. All of it. Somebody is going to ask, and they should get an answer.
- **“Keep it. Find out why, so it never happens again.”** — sets `{"mv-e1-clone":"kept"}`
    - **Reed Richards**: That is the responsible answer. I hate how much it sounds like the wrong one.
    - Two agents walk the clone into a van. It looks back at the place where Bill fell, and does not seem to understand it.

#### <a id="mv-e1-ambush-done"></a>Done `mv-e1-ambush-done`

_Afterwards Tony shows Peter where unregistered heroes go: Prison 42, built in the Negative Zone, outside normal space._  
**Peter Parker** _(sad)_: No trial. No lawyer. No way home. This isn’t what I took my mask off for.  
_That night Peter folds the red-and-gold suit and leaves it on his bed. Your Nubbins watch him go out of the window._  
**Tony Stark** _(sad)_: He’ll come back. People come back when they see the numbers.  

### Step 5: Get your Nubbins to the next safehouse before the S.H.I.E.L.D. sweep.

Hint: Resistance side only. A stealth expedition: keep your Nubbins out of the drones’ lights and keep moving. · check: `expedition:clear:mv-safehouse-run`

#### <a id="mv-e1-safehouse"></a>Scene `mv-e1-safehouse`

_Steve’s side calls itself the Secret Avengers. It has no budget, no headquarters, and a lot of borrowed vans._  
**Sam Wilson** _(happy)_: Welcome to the underground. The coffee’s bad. Everything else is worse. You’ll love it.  
_The safehouses are lent by ordinary people: a dentist, a nun, a man who runs a laundrette and asks for nothing back._  
**Luke Cage** _(angry)_: S.H.I.E.L.D. visited my wife this morning. My kid was in the room. They called it a courtesy call.  
**Steve Rogers**: Nobody here is a criminal for being what they are. Not Luke. Not the Keeper’s little ones.  
_Your Nubbins have been given a laundry basket with a blanket in it. They seem to think this is the best part of the war._  
_At midnight the scanner crackles. S.H.I.E.L.D. drones are coming down the street, one door at a time._  
**Sam Wilson** _(think)_: Steve, the Keeper’s babies glow on infrared. They’re like tiny space heaters.  
**Steve Rogers**: Then we keep them close and keep them moving. The laundrette has a back door.  
_Down the street, the drones turn their lights on the dentist’s house._  

**Choices**

- **Carry the basket yourself.** — sets `{"mv-e1-safehouse":"carried"}`
    - You tuck the basket under your arm. Somebody inside it is snoring.
- **Let the Nubbins run ahead on their own.** — sets `{"mv-e1-safehouse":"ran"}`
    - **Sam Wilson**: They know the way better than I do. That’s embarrassing.

#### <a id="mv-e1-safehouse-done"></a>Done `mv-e1-safehouse-done`

_You make the laundrette with thirty seconds to spare. The dryers hide your Nubbins’ heat._  
**Luke Cage**: Never thought I’d owe my freedom to a tumble dryer.  

### Step 6: See Frank Castle out of the Secret Avengers’ hideout.

Hint: Resistance side only. Talk to Steve after Frank is thrown out. There is no bout; Frank won’t fight him. · check: `talk:mv-frank-castle`

#### <a id="mv-e1-punisher"></a>Scene `mv-e1-punisher`

_The rebels hold Bill Foster’s wake in a church basement. He died in Tony’s ambush, between a clone of Thor and everybody else._  
**Steve Rogers** _(sad)_: Bill grew to sixty feet so the rest of us could run. I’ll remember that longer than the rest of this war.  
_A new recruit arrives: a man in a black coat with a white skull on his chest. Frank Castle. The Punisher._  
**Frank Castle**: Your side needs somebody who’ll do the things you won’t. I came to help.  
**Sam Wilson** _(think)_: Steve. We’re short of people. I hate it, but we are.  
_That night two small-time crooks come to the door, asking to join. They are nobodies. Frank shoots them both._  
_Your Nubbins scatter under the pews. One of them won’t stop shaking._  
**Steve Rogers** _(angry)_: Get out of my church.  
_Steve hits him. Frank doesn’t raise his hands. Steve hits him again, and Frank just takes it._  
**Frank Castle**: I won’t hit you back. You’re the only one of you I ever looked up to.  
**Steve Rogers** _(angry)_: Then you know exactly why you can’t stay.  
**Sam Wilson** _(think)_: Keeper. You’ve been in both camps now. Say something.  

**Choices**

- **Stand with Steve. Frank goes.** — sets `{"mv-e1-frank":"out"}`
    - You hold the door open. Frank looks at you, then at the Nubbins under the pews, and walks out into the rain.
- **“Tony has a god on a leash. Can we afford to lose anyone?”** — sets `{"mv-e1-frank":"argued"}`
    - **Steve Rogers**: Probably not. That’s exactly what he’s counting on.
    - **Steve Rogers**: If we win with him, we win as him. Then what was the point of not signing?
    - Frank nods, as if that were a fair answer, and walks out into the rain on his own.

#### <a id="mv-e1-punisher-done"></a>Done `mv-e1-punisher-done`

_The door shuts. Your Nubbins stay under the pews until Steve sits down on the floor beside them._  
**Steve Rogers** _(sad)_: Every war has a man like that waiting at the door. You decide early whether you let him in.  

### Step 7: Fight through New York in the last battle of the war.

Hint: The longest bout of the line. Your side fights beside you: armours if you registered, rebels if you resisted. · check: `karate:survive:mv-cw-final`

#### <a id="mv-e1-final"></a>Scene `mv-e1-final`

_Steve’s rebels break into Prison 42 and free everyone inside. They all come out in the middle of New York._  
_Tony’s side is waiting. Then everyone is fighting: in the streets, on the cars, through the shop windows of Times Square._  
_Your Nubbins herd a school trip down into a subway entrance. Overhead, a billboard of Tony’s face falls flat into the road._  
**Tony Stark** _(angry)_: Steve! Look at what we’re doing!  
**Steve Rogers** _(angry)_: I am looking. I’m looking at you.  
_The shield takes Tony’s armour apart plate by plate. Tony goes down. Steve raises the shield for the last blow._  
_Then hands grab his arms. A paramedic. A firefighter. A man from a deli. A woman in a bus driver’s jacket._  
**Steve Rogers** _(angry)_: Let go. Let go of me, I’m trying to—  
_They don’t let go. They hold on the way your Nubbins hold on to you in a thunderstorm._  
_Steve looks up. He sees the street: the smashed shopfronts, a bus on its side, the people._  
**Steve Rogers** _(sad)_: We’re not fighting for them any more. We’re just fighting.  
_He opens his hands. The shield drops onto the road and rings like a bell._  
**Steve Rogers**: Tell them to stand down. Everybody. I surrender.  

**Choices**

- **Go to Steve.** — sets `{"mv-e1-after":"steve"}`
    - You pick up the shield and hold it out to him. He shakes his head. Your Nubbins sit on it instead.
- **Go to Tony.** — sets `{"mv-e1-after":"tony"}`
    - You help Tony out of what’s left of the armour. He can’t look at anybody. Your Nubbins look at him anyway.

#### <a id="mv-e1-final-done"></a>Done `mv-e1-final-done`

_Steve is led away in cuffs. Your Nubbins follow the police van for a whole block before you call them back._  
**Tony Stark** _(sad)_: I won. Somebody explain why it doesn’t feel like it.  

### Step 8: Go to the courthouse to see Steve before his hearing.

Hint: There is nothing to win here. Walk up the steps with him. · check: `talk:mv-steve-courthouse`

#### <a id="mv-e1-courthouse"></a>Scene `mv-e1-courthouse`

_Some weeks later. A grey morning. A crowd outside the courthouse, half of them shouting, half of them crying._  
_Steve comes up the steps in chains. He sees your Nubbins in the crowd, and his whole face changes._  
**Steve Rogers** _(soft)_: You came. I told them not to let anybody— I’m glad you came.  
**Steve Rogers**: Whatever they decide in there, look after the little ones for me. Promise me that.  
**Sharon Carter** _(think)_: Steve, keep walking. Please. I don’t like how this crowd feels.  
_A shot from a high window. Then more, from the crowd, close by._  
_Steve falls on the steps. Your Nubbins are the first to reach him._  
**Sharon Carter** _(shock)_: No. No, no, no. Steve—  
_He looks at your Nubbins, not at the sky or the crowd. He starts to say something. He doesn’t finish it._  
_The crowd goes very quiet. Somewhere a camera is still clicking._  

#### <a id="mv-e1-courthouse-peter-stood"></a>Variant `mv-e1-courthouse-peter-stood`

_Variant of `mv-e1-courthouse`._

_Some weeks later. A grey morning. A crowd outside the courthouse, half of them shouting, half of them crying._  
_Steve comes up the steps in chains. He sees your Nubbins in the crowd, and his whole face changes._  
_Peter Parker is in the crowd too, bare-faced, the way he has been since the studio. People know him now, and he stands with you anyway._  
**Peter Parker** _(soft)_: Last time I stood on a stage with your little guys. Today it’s steps. Same idea.  
**Steve Rogers** _(soft)_: You came. I told them not to let anybody— I’m glad you came.  
**Steve Rogers**: Whatever they decide in there, look after the little ones for me. Promise me that.  
**Sharon Carter** _(think)_: Steve, keep walking. Please. I don’t like how this crowd feels.  
_A shot from a high window. Then more, from the crowd, close by._  
_Steve falls on the steps. Your Nubbins are the first to reach him._  
**Sharon Carter** _(shock)_: No. No, no, no. Steve—  
_He looks at your Nubbins, not at the sky or the crowd. He starts to say something. He doesn’t finish it._  
_The crowd goes very quiet. Somewhere a camera is still clicking._  

#### <a id="mv-e1-courthouse-peter-doubted"></a>Variant `mv-e1-courthouse-peter-doubted`

_Variant of `mv-e1-courthouse`._

_Some weeks later. A grey morning. A crowd outside the courthouse, half of them shouting, half of them crying._  
_Steve comes up the steps in chains. He sees your Nubbins in the crowd, and his whole face changes._  
_Peter Parker is in the crowd too, hood up, the mask back on under it. He chose the camera alone, and he has been alone with it since._  
**Peter Parker** _(sad)_: Don’t look at me. Please. I’m just here for him.  
**Steve Rogers** _(soft)_: You came. I told them not to let anybody— I’m glad you came.  
**Steve Rogers**: Whatever they decide in there, look after the little ones for me. Promise me that.  
**Sharon Carter** _(think)_: Steve, keep walking. Please. I don’t like how this crowd feels.  
_A shot from a high window. Then more, from the crowd, close by._  
_Steve falls on the steps. Your Nubbins are the first to reach him._  
**Sharon Carter** _(shock)_: No. No, no, no. Steve—  
_He looks at your Nubbins, not at the sky or the crowd. He starts to say something. He doesn’t finish it._  
_The crowd goes very quiet. Somewhere a camera is still clicking._  

#### <a id="mv-e1-courthouse-done"></a>Done `mv-e1-courthouse-done`

**Tony Stark** _(sad)_: I’d give it all back. The Act, the suits, the win. Every bit of it, for one more argument with him.  
_Tony sits on the courthouse steps until dark. Your Nubbins sit with him. You don’t ask them to._  

### Complete

#### <a id="mv-e1-complete"></a>Complete `mv-e1-complete`

_A long time later, at the waterfall, something small knocks on the air from the other side of the rift._  
**Kobik**: Hello. I promised not to change anything. So I didn’t. I only caught him while he was falling.  
**Kobik**: Was that allowed? Catching isn’t changing. I thought about it for a very long time.  
_A light the size of a doorway opens, and Steve Rogers stumbles out as if he has missed a step. He looks at his hands._  
**Steve Rogers** _(think)_: One second I was on the steps. Then somewhere bright, like a platform, waiting for a train.  
_Your Nubbins hit him at knee height, all at once. He sits down hard in the grass and lets them._  
**Steve Rogers** _(soft)_: Hey. Hey. I asked you to look after them. Looks like they looked after me.  
**Steve Rogers**: Tell Tony I’m back. And tell him we’ll need each other soon. Something’s coming.  
_Above the waterfall, for a moment, the rift flickers red._  

**Rewards**

- Witness on the Steps (title): Keeper title for finishing Civil War.
- Civil War ally (flag): Tony’s armoured army (registration) or Steve’s resistance (resistance) stands with you in The Last Ultron (E6).

Sets on completion: `{"mv-e1":true}`

**Notes:** BRANCHING: step order is s1, s2, then either reg-s3 + reg-s4 (mv-cw = registration) or res-s3 + res-s4 (mv-cw = resistance), then s5, s6 for both. Each path plays six steps. The ending is the same either way; mv-cw only decides the E6 ally (Tony’s armours or Steve’s resistance). Stamford: the blast is a white-out cut, no bodies shown; the backpack is the only detail. Bill Foster’s death is one lightning flash and a fall, no gore. Frank shooting the two crooks is off-screen (two muzzle flashes through a doorway). The courthouse shooting is staged the same way: sound, a fall, no blood. On the resistance path, Bill Foster dies off-screen in the ambush and is mourned in res-s4. The prison break in s5 assumes Prison 42 exists on both paths; on the resistance path it is introduced by its name in s5 only. The complete scene ties Steve’s return to the CA line’s Cube thread (Kobik, CA10) without repeating CA10’s resurrection: Kobik keeps her promise not to change anything and only catches him as he falls. SIGNATURE CHOICE: mv-e1-peter (peter-doubted | peter-stood: whether Peter unmasked alone or with the Nubbins beside him) pays off through MV_ENDGAMES_VARIANTS at mv-e1-courthouse (how Peter stands in the crowd), mv-e2-incursion (what Reed heard from him before the raft) and mv-e6-tony / mv-e6-steve (whether Peter comes to the last war bare-faced). The values carry a peter- prefix because the runner matches variants by value and mv-e2-kneel also uses stood. The safehouse / after-battle flags are cosmetic. Each path has a hard call of its own: on registration, mv-e1-clone (shutdown | kept) after Goliath dies; on resistance, mv-e1-frank (out | argued) over the Punisher. Both are cosmetic; Frank leaves either way, as in the source, and the clone is never used again on screen. Check Civil War #1–7, Captain America #25 and Captain America: Reborn beats before ship.

## E2. Secret Wars

*Secret Wars #1–9 (2015)* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Once the Doom line, Doomquest and The Cosmic Cube are finished. The rift opens on a sky with a second Earth in it. · requires: FF1, FF2, FF3, FF4, FF5, FF6, FF7, FF8, FF9, FF10, IM6, CA4

**Cast:** Reed Richards (Reed Richards, Mister Fantastic (Marvel Comics)), Sue Storm (Susan Storm, the Invisible Woman (Marvel Comics)), Victor von Doom (Victor von Doom, Doctor Doom (Marvel Comics)), Doctor Strange (Stephen Strange, Doctor Strange (Marvel Comics)), Owen Reece (Owen Reece, the Molecule Man (Marvel Comics)), Valeria Richards (Valeria Richards (Marvel Comics)), Franklin Richards (Franklin Richards (Marvel Comics)), T’Challa (T’Challa, Black Panther (Marvel Comics)), Lotso (Lots-o’-Huggin’ Bear, as a baron of Battleworld (Toy Story 3, Pixar))

### Step 1: Get aboard Reed’s life raft before the last two Earths touch.

Hint: A race under a falling sky. Speed matters more than stamina; don’t stop for fruit. · check: `race:finish:mv-incursion-raft`

#### <a id="mv-e2-incursion"></a>Scene `mv-e2-incursion`

_The rift opens on a sky with another Earth in it. It is close enough to see weather on it. It is getting closer._  
**Reed Richards** _(sad)_: Incursions. Two universes touch at one point and both die. We’ve watched it happen for years.  
**Reed Richards**: This is the last one. Every world, every timeline, ends today. I built a raft. It holds very few people.  
**Sue Storm** _(soft)_: Take the Keeper and the Nubbins. I’ll take the children on the other ship. We’ll meet on the other side.  
**Reed Richards** _(sad)_: There isn’t an other side, Sue. That’s the whole point of a raft.  
**Sue Storm**: Then you’ll build one. You always do.  
_Franklin waves at your Nubbins from the other ship’s hatch. Valeria pulls him back inside by the collar._  
_The two skies grind together. It sounds less like thunder than like a door closing on everything._  
**T’Challa**: Richards. The raft. Now. You can grieve on board.  
_Your Nubbins jump in first. Reed is the last aboard. Sue’s ship is a dot, then a spark, then nothing._  
_Behind you, both Earths touch. There is a light so large it has no colour._  

#### <a id="mv-e2-incursion-peter-stood"></a>Variant `mv-e2-incursion-peter-stood`

_Variant of `mv-e2-incursion`._

_The rift opens on a sky with another Earth in it. It is close enough to see weather on it. It is getting closer._  
**Reed Richards** _(sad)_: Incursions. Two universes touch at one point and both die. We’ve watched it happen for years.  
**Reed Richards**: This is the last one. Every world, every timeline, ends today. I built a raft. It holds very few people.  
**Reed Richards** _(sad)_: Parker asked me to put his aunt on it. Out loud, in front of everyone. He said he had nothing left to hide. I could not do it.  
**Sue Storm** _(soft)_: Take the Keeper and the Nubbins. I’ll take the children on the other ship. We’ll meet on the other side.  
**Reed Richards** _(sad)_: There isn’t an other side, Sue. That’s the whole point of a raft.  
**Sue Storm**: Then you’ll build one. You always do.  
_Franklin waves at your Nubbins from the other ship’s hatch. Valeria pulls him back inside by the collar._  
_The two skies grind together. It sounds less like thunder than like a door closing on everything._  
**T’Challa**: Richards. The raft. Now. You can grieve on board.  
_Your Nubbins jump in first. Reed is the last aboard. Sue’s ship is a dot, then a spark, then nothing._  
_Behind you, both Earths touch. There is a light so large it has no colour._  

#### <a id="mv-e2-incursion-peter-doubted"></a>Variant `mv-e2-incursion-peter-doubted`

_Variant of `mv-e2-incursion`._

_The rift opens on a sky with another Earth in it. It is close enough to see weather on it. It is getting closer._  
**Reed Richards** _(sad)_: Incursions. Two universes touch at one point and both die. We’ve watched it happen for years.  
**Reed Richards**: This is the last one. Every world, every timeline, ends today. I built a raft. It holds very few people.  
**Reed Richards** _(sad)_: Parker stopped answering his door after the broadcast. I never got to ask him who he wanted on it.  
**Sue Storm** _(soft)_: Take the Keeper and the Nubbins. I’ll take the children on the other ship. We’ll meet on the other side.  
**Reed Richards** _(sad)_: There isn’t an other side, Sue. That’s the whole point of a raft.  
**Sue Storm**: Then you’ll build one. You always do.  
_Franklin waves at your Nubbins from the other ship’s hatch. Valeria pulls him back inside by the collar._  
_The two skies grind together. It sounds less like thunder than like a door closing on everything._  
**T’Challa**: Richards. The raft. Now. You can grieve on board.  
_Your Nubbins jump in first. Reed is the last aboard. Sue’s ship is a dot, then a spark, then nothing._  
_Behind you, both Earths touch. There is a light so large it has no colour._  

#### <a id="mv-e2-incursion-done"></a>Done `mv-e2-incursion-done`

_You sleep. Nothing moves. There is no clock that can say for how long._  
_When the raft opens there is grass outside, and a sky, and a wall of rock running all the way to the horizon._  

### Step 2: Cross three domains of Battleworld and reach Doom’s capital.

Hint: An expedition through Sunnyside, the Lookout and Latveria. Each baron’s patrols follow a route; wait for the gap. · check: `expedition:clear:mv-battleworld`

#### <a id="mv-e2-battleworld"></a>Scene `mv-e2-battleworld`

_Eight years have passed outside the raft. In that time a world has been made out of the wreckage of all the others._  
_It is a patchwork. Each patch is a piece of a dead universe, stitched to the next with a seam of rock._  
_One patch is a daycare that smells of strawberries. One is a white lookout floating over cloud. One is a castle under a green flag._  
_Every patch has a baron. Every baron kneels to the same man. His statue is on every hill. At the Lookout, the clouds are trimmed into his face._  
**Lotso** _(happy)_: Well, hey there. New faces. Sunnyside’s a happy domain, friend. God Emperor Doom likes it happy.  
**Lotso**: And what Doom likes, I make sure of. Real sure. You keep those little critters in line, now.  
_At the Lookout, an old green man in white robes watches the edge of the world. He says nothing to Doom’s soldiers at all._  
_In Latveria the streets are clean, the trains run on time, and everyone looks at the ground when the guards go by._  
**Doctor Strange** _(think)_: You’re not from here. Nothing is from anywhere else, here. Quickly, before the Thors see you.  
_Doctor Strange, Sheriff of Battleworld, pulls you into a side street. He is Doom’s right hand. He looks very worried._  
**Doctor Strange**: Doom took the power of the Beyonders, the beings who ended the multiverse. He saved what he could. He made this.  
**Doctor Strange** _(sad)_: He is God here. I helped him do it. Some days I am proud of that. Today is not one of those days.  
_Boots at the corner. A Thor patrol, hammers on shoulders. Everyone in the street kneels to the nearest statue of Doom._  
**Doctor Strange** _(think)_: Kneel. It costs nothing. Everybody does it.  

**Choices**

- **Kneel, and tell the Nubbins to kneel.** — sets `{"mv-e2-kneel":"knelt"}`
    - Your Nubbins kneel, which for a Nubbin looks exactly like sitting. The patrol walks past without a glance.
    - **Doctor Strange**: It does cost something. I stopped noticing what, years ago.
- **Stay on your feet.** — sets `{"mv-e2-kneel":"stood"}`
    - You stay standing. Your Nubbins, watching you, stay standing too. A Thor stops, looks down at them, and frowns.
    - **Doctor Strange**: Mine. Sheriff’s business. Move along.
    - The patrol moves on. Strange lets out a breath he seems to have been holding for eight years.

#### <a id="mv-e2-battleworld-done"></a>Done `mv-e2-battleworld-done`

_In the throne room, God Emperor Doom sits in a seat as wide as a house. Beside him are Sue Storm and two children._  
**Victor von Doom**: Strange. You are late, and you smell of strangers.  

### Step 3: Get Reed’s survivors out of the throne room alive.

Hint: A survival bout against Doom’s Thors. You don’t need to beat them; reach the servants’ door. · check: `karate:survive:mv-doom-throne`

#### <a id="mv-e2-throne"></a>Scene `mv-e2-throne`

_Strange hid Reed’s raft for eight years. Today Doom’s Thors found it. Everyone is dragged to the throne together._  
**Victor von Doom** _(angry)_: Richards. Of course. The universe ends, and you survive it in a lifeboat.  
**Reed Richards**: Victor. What have you done with my family?  
**Victor von Doom** _(angry)_: I saved them. You were not there. I was.  
_Sue looks at Reed as if she almost remembers him, and doesn’t like the way that feels._  
_Eight years ago, Doom took Reed’s place. Sue and the children remember Doom as husband and father, and nothing else._  
**Valeria Richards** _(think)_: Father, who is that man? Why is he looking at Mother like that?  
_Doom flinches at the word Father. Not from shame. From something closer to fear._  
**Doctor Strange** _(sad)_: Victor, I hid them. I should have told you. I wanted to see what you would do.  
**Victor von Doom** _(angry)_: You tested me. In my own house.  
_Doom lifts one hand. Strange is gone before he can finish his next word. Only his cloak falls to the floor._  
_Your Nubbins dart under Sue’s chair. Franklin pulls one onto his lap and holds on to it very tightly._  
**Franklin Richards** _(shock)_: Father? Why did you do that? He used to tell us stories.  
**Victor von Doom** _(sad)_: He betrayed me. Everything I made, I made so nobody would ever die like that again.  

#### <a id="mv-e2-throne-done"></a>Done `mv-e2-throne-done`

_In the uproar, Reed’s survivors break for the doors. Your Nubbins lead them through the servants’ halls._  
**Reed Richards** _(think)_: Did you see his face? Doom was frightened. Of what Strange said, of what the children saw. That’s the crack.  

### Step 4: Stand with Reed when the Molecule Man moves the power.

Hint: A long bout against God Emperor Doom. The power changes hands halfway; keep your Nubbins close to Reed. · check: `karate:survive:mv-god-emperor`

#### <a id="mv-e2-power"></a>Scene `mv-e2-power`

_Under all the rock, at the root of Battleworld, sits Owen Reece, the Molecule Man. He has been Doom’s battery for eight years._  
**Owen Reece**: Hi. I’m holding up the universe. It’s a lot. Doom made me promise to stay down here. I like keeping promises.  
**Owen Reece** _(think)_: But he’s frightening the kids now. I don’t like that. I’ll give it to Reed instead. Just to see.  
_Doom arrives as the power begins to move. He tears the cavern open with one hand._  
**Victor von Doom** _(angry)_: Reece! You belong to me!  
**Owen Reece**: Nobody belongs to anybody, Victor. You never got that part.  
_Light pours out of Doom like water through a broken dam, and into Reed. Doom is a man again, in a mask, on his knees._  
**Reed Richards**: It’s over, Victor. Just you and me now. No gods.  
_They fight with their fists, like schoolboys. It is not a fair fight. Neither of them is any good at it._  
_At last Doom stops, sits back against the rock, and takes off his mask. The face under it is as scarred as ever._  
**Victor von Doom** _(sad)_: Answer me. Not Richards. You, Keeper. You and your small ones. You walked through my world.  
**Victor von Doom**: Would he have done better? If the power had been his and not mine. Would it have been better?  

**Choices**

- **“Yes. He would have.”** — sets `{"mv-doom":"ally"}`
    - Your Nubbins look at Doom and nod, slowly, the way they nod at something sad but true.
    - **Victor von Doom**: Yes. He would. I have known it since the first day. Thank you for not lying to me.
- **“No. You did the best anybody could.”** — sets `{"mv-doom":"rival"}`
    - Your Nubbins shuffle their feet. They don’t look at him.
    - **Victor von Doom**: A kind lie. He would have done better. I know it. I have always known it.
    - **Victor von Doom**: Do not soften the truth for me again, Keeper. Doom remembers who tried.

#### <a id="mv-e2-power-done"></a>Done `mv-e2-power-done`

_Reed opens his hands. The power in them begins to mend Battleworld’s seams, one by one, gently, like setting bones._  
**Reed Richards**: I’m not keeping this. Not one minute longer than I need it.  

### Step 5: Visit Doom in Latveria.

Hint: Doom has asked for you. Bring your Nubbins; he asked for them too. · check: `talk:mv-doom-healed`

#### <a id="mv-e2-latveria"></a>Scene `mv-e2-latveria`

_Latveria is just Latveria again. People walk about with their heads up and complain about the weather._  
_Doom receives you in a small room with no throne in it. He isn’t wearing his mask._  
_His face is whole. Not a scar on it. Your Nubbins stare at him, then, carefully, at each other._  
**Victor von Doom**: Sit. All of you. There is wine for the Keeper and fruit for the small ones.  
**Victor von Doom** _(think)_: Richards did this, at the very end. Mended it, the way you would mend a cracked cup. Without asking.  
**Victor von Doom**: I have wanted this face back since I was a young fool in a laboratory. Now I keep looking for the scars.  
**Victor von Doom**: Who is Doom, without a reason to hate Reed Richards? I have no idea. I find that I want to know.  
**Victor von Doom** _(soft)_: You told me the truth when a lie was cheaper. Doom does not forget a debt.  
**Victor von Doom** _(think)_: There is a suit of armour in my workshop. Red and gold. Stark is not using it at present. Perhaps I will.  
_As you leave, he puts the mask back on. Then he takes it off again and sets it on the table, face down._  

### Complete

#### <a id="mv-e2-complete"></a>Complete `mv-e2-complete`

_At the edge of what is left, Reed and Sue stand by a small ship. Franklin and Valeria are already aboard, arguing._  
**Sue Storm** _(happy)_: We’re going to rebuild it. All of it. Every universe, one at a time.  
**Reed Richards** _(happy)_: Franklin makes them. Valeria checks his maths. I carry the toolbox.  
**Sue Storm** _(happy)_: I’ve put a lamp in the window of the ship. For when you work late.  
**Reed Richards** _(think)_: Sue. It’s a ship. It doesn’t have a window.  
**Sue Storm**: It does now.  
**Sue Storm** _(soft)_: Thank you, Keeper. For the raft, and the throne room, and for keeping my children company when they didn’t know me.  
_The ship lifts off into a dark that is already beginning to fill up with stars._  
_Back at the waterfall, your Nubbins watch the rift for a long time, as if a new world might come out of it._  

**Rewards**

- Last Incursion Survivor (title): Keeper title for finishing Secret Wars.
- Infamous Iron Man (flag): Unlocks the Doom line’s epilogue, Infamous Iron Man (FF-EP).
- Doom at the end (flag): Doom comes to The Last Ultron (E6) as an ally if you told him the truth, or as a wildcard if you did not.

Sets on completion: `{"mv-e2":true}`

**Notes:** Choice in s4: truth sets mv-doom = ally; the kind lie sets mv-doom = rival. Doom admits Reed would have done better either way, as in the source; the flag records whether your Nubbins made him say it to an honest face. In s5, line mv-e2-latveria#7 (0-based; “You told me the truth…”) is the ally version. If mv-doom = rival, replace it with: l('doom', 'You lied to me, kindly, in a cave under the world. I will be watching you, Keeper. Closely.', 'think'). Battleworld domains reuse the Sunnyside (Toy Story), Kami’s Lookout (Dragon Ball) and Latveria sets with Doom’s banners added; the player need not have played those lines. Lotso is a Doom-appointed baron, used for one beat only. The old green man at the Lookout is Kami, unnamed here. The Thors are Battleworld’s police, shown as a crowd sprite. The kneel choice in s2 (mv-e2-kneel = knelt | stood) is cosmetic; it rhymes with Civil War’s registration question: safety by bending, or risk by standing. Strange’s death: a flash and a falling cloak, no body. Sets mv-e2, which FF-EP (Infamous Iron Man) requires as E2. Check Secret Wars (2015) #1–9 beats before ship.

## E3. Armageddon

*Spawn #150–164; Avengers vol. 8 #32–38 (Age of Khonshu)* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Once every Spawn and Moon Knight storyline is finished. The rift opens under a sky split white and red. · requires: SP1, SP2, SP3, SP4, SP5, SP6, SP7, SP8, MK1, MK2, MK3, MK4, MK5, MK6, MK7, MK8

**Cast:** Spawn (Al Simmons / Spawn (Image Comics)), Cogliostro (Cogliostro, revealed as Cain (Image Comics)), Mammon (Mammon (Spawn, Image Comics)), The Herald (Heaven’s emissary in Spawn’s Armageddon arc (Spawn #150–164)), Marc Spector (Marc Spector / Moon Knight (Marvel Comics)), Steven Grant (Steven Grant, one of Moon Knight’s identities (Marvel Comics)), Jake Lockley (Jake Lockley, one of Moon Knight’s identities (Marvel Comics)), Khonshu (Khonshu (Marvel Comics)), Marlene (Marlene Alraune (Marvel Comics)), Bobby (An original alley regular from the Spawn line (not a source character))

### Step 1: Hold Spawn’s alley against the risen dead until dawn.

Hint: A survival bout in waves. Spawn’s chains do the heavy work; your Nubbins keep the dead off his back. · check: `karate:survive:mv-armageddon-dead`

#### <a id="mv-e3-war"></a>Scene `mv-e3-war`

_The rift opens on Spawn’s alley. The sky above it is split down the middle: white on one side, red on the other._  
_The city’s graves are open. The dead walk down Main Street in their funeral clothes, waiting politely at the crossings._  
_Bobby’s barrel fire is still lit. The alley folk crowd behind it with bricks and bin lids. Bobby has a cricket bat. Nobody asks._  
**Spawn** _(angry)_: They stopped pretending. Heaven and Hell, both of them. Earth’s the board, and they’re done playing slow.  
_On a rooftop stands a thin man in a very good suit. Behind him is an army that goes back further than the street does._  
**Mammon** _(happy)_: Al. My favourite investment. Malebolgia’s chair is still warm. Sit in it, lead them, and the dead go home tonight.  
_On the opposite roof, a figure of hard white light unfolds wings the size of billboards._  
**The Herald**: Heaven has a seat too, Hellspawn. Kneel, and your soul is washed white. Your Wanda will find you waiting for her.  
**Spawn** _(shock)_: …Wanda’s alive. She isn’t up there.  
**The Herald**: Not yet. Everyone comes to us in the end. Be there first, and be clean, when she arrives.  
**Spawn** _(angry)_: Two job offers in one night. Hell wants my hands. Heaven wants my knees.  
_The number in his eye reads 1,214. It said 9,999 once. Your fearless Nubbin climbs his cape and settles on his shoulder._  
**Spawn**: Stay close, kid. Tonight everything’s hungry. Even the ones with halos.  

#### <a id="mv-e3-war-done"></a>Done `mv-e3-war-done`

_The dead keep coming until dawn. They aren’t angry. They only want to be told where to go, and two armies keep telling them._  
_One of them stops at the barrel fire to warm its hands. Bobby gives it his spot. It nods, and shuffles on._  
**Bobby** _(sad)_: Knew him. Sold papers on the corner thirty years. Never hurt a soul. And they want him marching.  
**Spawn**: I’m burning it fast. I’ll worry about that tomorrow, if there is one.  

### Step 2: Find Marc Spector before Khonshu calls him up into the sky.

Hint: A night expedition across New York. Your Nubbins see well by moonlight; let them lead. · check: `expedition:clear:mv-khonshu-night`

#### <a id="mv-e3-sky"></a>Scene `mv-e3-sky`

_In the next world over, the moon does not set. For three nights it has hung over New York, growing._  
_It is not the moon. It is a bird’s skull, white and enormous, and it is looking in at every window._  
**Khonshu** _(happy)_: The gods of above and below are at war, and the sky is empty. So I have taken it.  
**Khonshu**: Marc. My fist. Come up. Come home. You will be the high priest of the new night.  
_You find him on the roof of the Midnight Mission. Below, Rosa is pouring coffee for a queue that goes round the block._  
_He is in the white suit, and his hands are shaking. When he turns round, you aren’t sure who has turned._  
**Steven Grant** _(think)_: Keeper. It’s Steven. No. Wait.  
**Marc Spector** _(sad)_: Marc. It’s Marc. They keep handing me the wheel and taking it back. He’s shouting so loud we can’t hear each other.  
**Marlene**: Look at me, not at him. He’s offering you a throne. Ask him what it costs.  
**Jake Lockley**: Costs the street. Always does. You go up there, who walks Rosa home?  
_Your Nubbins have found the Mission lantern. It is still lit. They have arranged themselves round it like a small fence._  
**Marc Spector**: Keeper. Talk to me. Whichever one of me you trust tonight. I’ll pass the message on.  

**Choices**

- **Talk to Marc.** — sets `{"mv-e3-face":"marc"}`
    - **Marc Spector**: The soldier. Figures. You want the one who knows what a god’s promises are worth.
    - **Marc Spector**: Nothing. They’re worth nothing. I’ll go up there and tell him so to his face.
- **Talk to Steven.** — sets `{"mv-e3-face":"steven"}`
    - **Steven Grant**: Me? Nobody asks for me in a crisis. I’m the one who knows which fork to use.
    - **Steven Grant**: Then here’s my advice. He’s a host who wants us at his table forever. We go up, we’re polite, we leave early.
- **Talk to Jake.** — sets `{"mv-e3-face":"jake"}`
    - **Jake Lockley**: Plain answer, then. He wants Marc, he takes all three of us. So all three of us say no.
    - **Jake Lockley**: I’ll drive. I always drive.

#### <a id="mv-e3-sky-done"></a>Done `mv-e3-sky-done`

**Khonshu**: Bring your little lamp-bearers, Marc. Bring the Keeper. All are welcome in my sky.  
**Steven Grant**: Colleagues. Mr. Knight calls them colleagues.  
_A stair of silver light comes down onto the Mission roof. Every step is a different phase of the moon._  
**Marc Spector** _(think)_: First there’s a bridge. He says there’s a monster on it. He usually lies about the monsters.  

### Step 3: Stop Spawn and Moon Knight from killing each other on the bridge.

Hint: A bout against two fighters who don’t want you there. You win by keeping both on their feet until they stop. · check: `karate:subdue:mv-spawn-vs-knight`

#### <a id="mv-e3-meet"></a>Scene `mv-e3-meet`

_Where the two worlds touch, a bridge crosses a black river. On it the Hellspawn and the Fist of Khonshu meet._  
_Below, the dead stand in the water up to their knees, very still, waiting to see who wins._  
_Each man has been told the other is the enemy’s best weapon. Each has been told to end it tonight._  
**Khonshu** _(angry)_: There stands Hell’s general. Break him, and the dead have no one to follow.  
**Mammon**: There’s the moon god’s dog, Al. Put him down and the night is ours too.  
**The Herald**: Strike him in Heaven’s name, Hellspawn, and you will never feel Hell’s heat again.  
**Spawn**: Everybody wants the same thing from me tonight. Funny how that works.  
**Marc Spector**: Nothing personal.  
**Spawn**: Never is.  
_Chains come off the cape like snakes. Crescent darts slide out of the white sleeves. The bridge starts to crack._  
_Your Nubbins look at each other, then run straight into the middle._  

#### <a id="mv-e3-meet-done"></a>Done `mv-e3-meet-done`

**Marc Spector** _(think)_: Your boss talk a lot? Mine never stops. He says I’ll be free when the job’s done.  
**Spawn** _(sad)_: Mine said the same. I took his deal to see my wife one more time.  
**Marc Spector**: I took mine because I didn’t want to stay dead in the sand. Did yours ever call you “son”?  
**Spawn**: “Soldier.” Same word. Cheaper suit.  
_Your Nubbin climbs off Spawn’s shoulder and onto Marc’s. Neither man tells it to._  
**Spawn**: Two soldiers. Three masters. Not one of them worth it.  

### Step 4: Keep the Mission lantern lit while Marc finds his way down from the sky.

Hint: A long timing minigame. Your Nubbins take turns feeding the flame; never let two rest at once. · check: `minigame:clear:mv-keep-lantern`

#### <a id="mv-e3-refusal"></a>Scene `mv-e3-refusal`

_Both armies come to the foot of the bridge for Spawn’s answer. Wings on one bank, horns on the other, the dead in the river between._  
**The Herald**: Kneel, Al Simmons. Clean, forgiven, and waiting for her when she comes.  
**Mammon** _(happy)_: Or sit, and never wait for anything again. Choose, Al. Choosing is the one thing you were ever good at.  
**Spawn** _(angry)_: You’re right. Here’s mine.  
_He spends it. All of it. The number runs from 1,214 to nothing, and every point leaves the suit in one green wave._  
**Spawn**: It was never mine, Mammon. It was yours. Have it back.  
_The wave goes through both armies. Swords drop. The dead lie down. Far above, Marc stands alone before Khonshu’s throne._  
**Khonshu**: Not a throne, then, my son. A cure. Sit, and I make you one man. No Steven. No Jake. Quiet, at last.  
**Marc Spector** _(think)_: One man. One head. God, that’s tempting.  
**Marc Spector**: But I’ve met the people in here, and I like every one of them better than I like you. No.  
**Steven Grant**: Seconded.  
**Jake Lockley**: Thirded. That a word?  
_Marc turns his back on the throne. The palace comes apart round him, and the silver stair goes dark under his feet._  
**Marlene**: He can’t see the way down. Keeper, the lantern. Whatever happens, keep it lit.  

#### <a id="mv-e3-refusal-done"></a>Done `mv-e3-refusal-done`

_Your Nubbins feed the lantern all night, one at a time, in turns. It gutters twice. It never goes out._  
_Just before dawn a man in a torn white suit comes down out of the dark, following the light, one step at a time._  
**Marc Spector** _(think)_: I counted the steps. Steven counted different. Jake says there weren’t any steps.  
**Marlene** _(soft)_: Then it’s a good thing the light was real.  

### Step 5: Help Marc seal Khonshu away.

Hint: Talk to Marc on the Mission steps. The choice is his to make, but he wants yours first. · check: `talk:mv-marc-seal`

#### <a id="mv-e3-seal"></a>Scene `mv-e3-seal`

_Khonshu’s palace has fallen into the sea. The god himself is small now, a bird-skulled shape inside a cracked stone jar._  
**Khonshu** _(angry)_: You cannot hold me forever. Nothing holds a god forever.  
**Marc Spector**: Long enough will do.  
_Marlene wraps the jar in chain from Spawn’s cape. Spawn holds the lid down with one hand. He looks very tired._  
_Marc sits on the Mission steps. There is still silver in his hands. A little. It moves when he flexes his fingers._  
**Marc Spector** _(think)_: He left some of it in me. Enough to be strong. Enough that nobody on my street gets hurt again.  
**Marc Spector**: But it’s his. It’ll always be his. Every time I use it, I’ll hear him laugh.  
**Steven Grant**: We could pour it in the jar with him. Be ordinary. I’m good at ordinary.  
**Jake Lockley**: Ordinary gets you shot in an alley, Steven. He’s not the last thing that’ll come for this street.  
**Spawn** _(think)_: Take it from a guy who just spent everything. Power’s a leash. Doesn’t matter who holds the other end.  
**Marc Spector**: Keeper. You held the light. You tell me. Do I keep it?  

**Choices**

- **“Keep it. This isn’t over.”** — sets `{"mv-mk":"power"}`
    - Marc closes his hand. The silver sinks into the skin and stays there.
    - **Marc Spector**: Then I keep it. And I answer to nobody. Not him. Not you. Remember that, when the time comes.
- **“Pour it in the jar. Be yourself.”** — sets `{"mv-mk":"free"}`
    - Marc holds his hands over the jar. The silver drips out of them like water, and the lid seals with a click.
    - **Marc Spector**: Weaker. Lighter. Mine. All three of us. I think I like it.

### Complete

#### <a id="mv-e3-complete"></a>Complete `mv-e3-complete`

_The dead go back into the ground, slightly embarrassed. The sky closes over and is one colour again._  
**Spawn** _(think)_: No countdown. No power. No boss. Just a guy in a cape in an alley.  
**Cogliostro**: You have almost nothing left, Simmons. I have never seen you look so well.  
**Spawn**: Almost nothing. I can work with almost nothing. It’s more than I came back with.  
_Bobby saves him the spot by the barrel fire. Spawn takes it. For once the suit does nothing but keep him warm._  
_Marc walks home through the city. Steven buys bread. Jake buys a newspaper. Marc pays for both, and gets the change wrong._  
**Marc Spector** _(soft)_: Three faces. One man. Not a god’s fist. Just a guy who works nights.  
_Your Nubbins carry the lantern back through the rift. It is still burning._  

**Rewards**

- Lamp in the Dark (title): Keeper title for finishing Armageddon.
- Spawn and Moon Knight (flag): Both come to The Last Ultron (E6). Moon Knight comes at full strength answering to no one (power) or weaker and steadier (free).

Sets on completion: `{"mv-e3":true}`

**Notes:** Choice in s5 sets mv-mk = power | free (MK8 uses mv-mk-complete, so there is no clash). Spawn argues for free and Jake for power, so neither answer is the obvious one. Choice in s2 sets mv-e3-face = marc | steven | jake (cosmetic): who the Keeper speaks to on the Mission roof. The opening of s2 is deliberately unsure who is talking. Khonshu’s last offer in s4 is not power but a cure: one mind, no Steven, no Jake. Marc’s refusal is the Moon Knight line’s payoff; give the “God, that’s tempting” line a held beat. Spawn’s counter: s1 shows 1,214 and s4 runs it to zero by his own choice. If the game tracks the real value, use it in both lines. This is the payoff of the Clown’s notebook (SP2): if the Keeper has it, its last page (0, smiley face) can flash on screen as the counter empties. Callbacks: if mv-sp-twist = left, Tony Twist can be a face among the dead in s1 (no lines). If mv-sp-cain = unforgiven, Cog says his complete-scene line from the alley mouth and comes no closer. Bobby is the SP1 and SP3 (Overt-Kill) alley regular; his cricket bat is a prop gag only. With power, E6 gives Marc lines reminding you he answers to no one (mv-e6-mk-power). With free, he is slower and steadier (mv-e6-mk-free). “Your Nubbin, the one that was never afraid of him” is the SP1 Nubbin if the game remembers it; otherwise any party Nubbin. The lantern is the Mission lantern from MK7, back on the Mission roof. The walk down from the sky by its light happens only here: MK8 ends with Khonshu throwing Marc out of his palace. The dead are shown as grey, shuffling silhouettes, never rotting. The Herald is a faceless figure of white light. Mammon’s army is a painted backdrop. Cogliostro appears as Cain only by name in SP8; here he is simply Cog. Check Spawn #150–164 and Avengers vol. 8 #32–38 beats before ship.

## E4. The 23rd Budokai

*Dragon Ball, the 23rd World Martial Arts Tournament through the final chapter of the original series* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Once every Dragon Ball storyline is finished. The rift opens on Papaya Island on finals day. · requires: DB1, DB2, DB3, DB4, DB5, DB6, DB7, DB8, DB9, DB10, DB11, DB12, DB13, DB14, DB15, DB16, DB17, DB18, DB19, DB20

**Cast:** Goku (Son Goku (Dragon Ball, Akira Toriyama / Toei)), Krillin (Krillin (Dragon Ball)), Tien (Tien Shinhan (Dragon Ball)), Mercenary Tao (Mercenary Tao, rebuilt as a cyborg (Dragon Ball)), Shen (Kami fighting in the borrowed body of Shen (Dragon Ball)), Kami (Kami, guardian of the Earth (Dragon Ball)), Piccolo (Piccolo Jr., entered as Ma Junior (Dragon Ball)), Chi-Chi (Chi-Chi (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Yajirobe (Yajirobe (Dragon Ball)), The Announcer (The World Martial Arts Tournament announcer (Dragon Ball)), Shenron (Shenron, the Eternal Dragon (Dragon Ball))

### Step 1: Watch Tien beat Tao and Shen beat Yamcha, then work Goku’s corner against Tien.

Hint: A spectator round, then a karate bout from Goku’s corner. Your Nubbins are allowed ringside as seconds. · check: `karate:win:mv-23rd-bracket`

#### <a id="mv-e4-bracket"></a>Scene `mv-e4-bracket`

_The rift opens on Papaya Island: banners, food stalls, and a stone ring the size of a village square._  
**The Announcer** _(happy)_: Welcome to the twenty-third World Martial Arts Tournament! Would somebody please make sure the ring survives this year!  
**Goku** _(happy)_: Keeper! You came! And you brought the little ones! Did you eat? I ate. I could eat again.  
**Krillin**: He’s had four lunches. The noodle man is crying.  
_First match: Tien against a man who is half machine. Mercenary Tao, rebuilt in steel._  
**Mercenary Tao** _(angry)_: Three years in a hospital, Tien. Three years being put back together. They gave me a few improvements.  
_A blade unfolds from his arm. The crowd gasps. Tien doesn’t move._  
**Tien** _(think)_: You taught me to kill. I learned something better since. Watch.  
_It is over in a minute. Tao lands outside the ring, still talking._  
_Next, Yamcha draws the quiet stranger called Shen. Yamcha lands flat on his back in the first exchange, looking puzzled._  
**Shen** _(soft)_: Forgive me. I needed that place in the bracket more than you did.  
_Then the semi-final: Goku against Tien, the reigning champion._  
**Tien**: No tricks this time, and nobody in my ear. Just you and me.  
**Goku** _(happy)_: Yeah! I’ve waited three years for this!  
_Your Nubbins have been given a towel, a bucket and one very serious sponge. They apply all three to Goku at once._  
**Krillin**: That’s not how corners work.  
**Goku** _(happy)_: It’s great! Do it again!  

#### <a id="mv-e4-bracket-done"></a>Done `mv-e4-bracket-done`

_Goku wins it clean. Tien sits up outside the ring and starts to laugh._  
**Tien** _(happy)_: I won last time by a hair. I wanted to know if it was luck. It was.  
**Shen** _(sad)_: Good. You are ready, Goku. I am sorry for what comes next.  

### Step 2: Find the bottle Piccolo coughs up before somebody steps on it.

Hint: A short search expedition round the arena. A Fly Nubbin can check the rooftops; a small one fits under the stands. · check: `expedition:clear:mv-papaya-arena`

#### <a id="mv-e4-junior"></a>Scene `mv-e4-junior`

_Next match: Shen against the cloaked fighter entered as Ma Junior. The cloak comes off. He is green, tall, and very angry._  
**Piccolo** _(angry)_: Remember me, old man? My father went into the ground, and I came out of his last egg.  
**Shen** _(sad)_: Piccolo. Your father’s son. I had hoped you would grow up different.  
**Piccolo**: I grew up hungry. That’s different enough.  
_Shen casts the sealing wave to trap him in a bottle. Piccolo turns it back. Shen vanishes into the bottle, and Piccolo swallows it._  
**Krillin** _(shock)_: He swallowed him! He just swallowed the guy!  
**Goku** _(angry)_: That was Kami. I knew it! Hey! Spit him out!  
**Piccolo** _(happy)_: He and I were one being, once. If I die, he dies too. Hit me hard, Goku, and see what happens to your god.  
_Goku hits him in the stomach. Not hard. Just exactly right._  
_Piccolo coughs. Something small and glass goes skittering away under the stands._  
**Bulma** _(shock)_: Find that bottle! Somebody find that bottle before a fat man sits on it!  

#### <a id="mv-e4-junior-done"></a>Done `mv-e4-junior-done`

_Your Nubbin comes out from under the stands rolling the bottle in front of it like a ball. Goku pulls the cork._  
**Kami** _(soft)_: Thank you, little one. That was a very undignified afternoon for a god.  

### Step 3: Stay in Goku’s corner through the final against Piccolo.

Hint: The line’s biggest bout. You can’t win it for him; keep your Nubbins’ cheer meter up until the last exchange. · check: `karate:survive:mv-goku-vs-piccolo`

#### <a id="mv-e4-final"></a>Scene `mv-e4-final`

**The Announcer**: The final! Son Goku against Ma Junior! Management has asked me to say it is not responsible for anything!  
_They start fast and go faster. The ring cracks under them. Then it breaks. Then it is gone._  
**Piccolo** _(angry)_: I came out of an egg to do one thing. This is it.  
**Goku** _(happy)_: You’re really strong! This is the best fight I’ve ever had!  
_Piccolo grows until he blocks out the sun. Goku fights him from the inside out, and Piccolo shrinks back, furious._  
_Then the bad part. Piccolo catches Goku’s arm and breaks it. Then the other arm. Then one leg, and the other._  
_Your Nubbins cover their eyes. Chi-Chi doesn’t. She grips the barrier so hard it cracks._  
**Chi-Chi** _(angry)_: Get up, Goku! You promised to marry me, so you are not allowed to lose!  
**Piccolo** _(happy)_: No arms. No legs. What will you do now, hero? Bite me?  
**Goku**: Something like that.  

#### <a id="mv-e4-final-done"></a>Done `mv-e4-final-done`

_Goku fires a Kamehameha at the ground behind him. It throws him through the air head first, straight into Piccolo’s chest._  
_Piccolo lands where the edge of the ring used to be. The announcer checks three times before he dares say it._  
**The Announcer** _(happy)_: The winner, and champion… Son Goku!  

### Step 4: Carry the last Senzu bean from Goku to Piccolo.

Hint: Talk to Yajirobe for the bag, then take the bean across what used to be the ring. Your smallest Nubbin is least threatening. · check: `deliver:mv-senzu:piccolo`

#### <a id="mv-e4-mercy"></a>Scene `mv-e4-mercy`

_Goku lies in the rubble, grinning, able to move nothing but his face. Piccolo lies a hundred feet away, unable to move at all._  
**Kami** _(sad)_: Goku. Finish him, and I die with him. Do it anyway. One old god is a fair price to be rid of him.  
**Goku**: Nah.  
**Kami**: Goku—  
**Goku** _(think)_: If I finish him, you’re gone too. Then who looks after the dragon? Besides…  
**Goku** _(happy)_: He’s really strong. I want to fight him again some day.  
**Yajirobe**: Korin sent beans. There’s two. There were more. I was hungry. Don’t look at me like that.  
_Goku eats one. His bones knit with a sound like knuckles cracking. He stands, stretches, and looks at the last bean._  
**Goku**: Keeper, can your little one take this over to him? He won’t take it from me. He might take it from them.  
**Krillin** _(shock)_: Goku, you’re out of your mind! He’ll kill us all the second he’s up!  
**Goku**: Maybe. Maybe not today.  

**Choices**

- **Carry it over. No conditions.** — sets `{"mv-e4-bean":"freely"}`
    - **Goku**: Yeah. If you make him promise something, it isn’t really a present.
    - **Krillin**: It isn’t a present! It’s a loaded weapon with a cape!
- **“He gets it if he swears to leave Krillin and Kami alone.”** — sets `{"mv-e4-bean":"terms"}`
    - **Krillin**: Thank you! Finally! One sensible person on this island!
    - **Goku**: He won’t swear. But it’s fair to ask. Go on, little one. Ask him nicely.

#### <a id="mv-e4-mercy-done"></a>Done `mv-e4-mercy-done`

_Your Nubbin drops the bean on Piccolo’s chest and backs away fast. Piccolo looks at it for a long time. Then he eats it._  
**Piccolo** _(angry)_: I make no promises. Not to him, not to a god, and not to a dumpling with legs.  
**Piccolo** _(angry)_: This is a mistake, Goku. I’ll come back. I’ll beat you. Then I’ll take this world.  
**Goku** _(happy)_: Sounds good! Train hard, okay?  
_Piccolo flies off without another word. Your Nubbin watches him go and doesn’t seem worried at all._  

### Step 5: Call the dragon at Kami’s Lookout and decide what to do with the wish.

Hint: Bring the second set of seven Dragon Balls to the Lookout. Shenron waits for your answer; there’s no wrong one. · check: `summon:mv-shenron`

#### <a id="mv-e4-wish"></a>Scene `mv-e4-wish`

_High on Kami’s Lookout, above the clouds, the seven balls of the second set glow on the white tiles._  
**Kami**: The dragon has one wish in him this year, and it is yours. You and your little ones earned it.  
_The sky goes dark at noon. Shenron rises out of the balls, coil after green coil, until he fills the sky._  
**Shenron**: Speak. I grant one wish. Then I sleep.  
**Kami** _(soft)_: You could bring back everyone this long story took who was never wished home. The soldiers. The villagers. The nameless ones.  
**Krillin** _(sad)_: Spend it. I was dead once, Keeper. Take it from me: they want to come back. Every one of them.  
**Goku** _(think)_: Or you could keep it. Something bad’s coming. I can feel it, like weather.  
**Bulma** _(shock)_: You can keep a wish? I’ve never heard of anyone keeping a wish!  
**Kami** _(think)_: It has never been done in my lifetime. But very little you do has been done before.  
**Shenron**: I will hold it, if you ask. A wish granted later is still a wish. Call me when you need it.  
_Your Nubbins stare up at the dragon. One of them sneezes. The dragon doesn’t mind._  

**Choices**

- **Spend it. Bring them all home.** — sets `{"mv-wish":"spent"}`
    - **Shenron**: It is done.
    - All over the world, in towns with a hole in them, doors open and people walk back through them.
    - **Goku**: Hey. That was a good one.
- **Save it. Something is coming.** — sets `{"mv-wish":"saved"}`
    - **Shenron**: Then I will hold it for you. Say your own name when the time comes, and I will hear.
    - The balls rise and scatter across the sky. One small light drops back down into your pocket and stays there, warm.

### Complete

#### <a id="mv-e4-complete"></a>Complete `mv-e4-complete`

_At the edge of the island, Chi-Chi waits beside the Flying Nimbus with her arms folded._  
**Chi-Chi** _(happy)_: You did promise. In front of everybody. You just didn’t know what it meant.  
**Goku** _(happy)_: I still don’t, really. But it sounds fun. Is there food at a wedding?  
**Chi-Chi**: There’s food at this one.  
_Goku helps her onto the Nimbus. It holds her up, which means her heart is pure, which surprises Krillin a great deal._  
**Krillin** _(happy)_: Huh. Good for her.  
_They fly off towards the mountains. Your Nubbins run along the beach beneath them until they run out of beach._  

**Rewards**

- Goku’s Corner (title): Keeper title for finishing The 23rd Budokai.
- Saved Wish (item): Only if you saved it: a small warm light from the Dragon Balls, carried in your pocket. It can be spent once, in The Last Ultron (E6).
- Goku at the end (flag): Goku comes to The Last Ultron (E6), with the saved wish if you kept it.

Sets on completion: `{"mv-e4":true}`

**Notes:** Choice in s5 sets mv-wish = spent | saved. Give the Saved Wish item only on saved. E6 reads mv-wish to offer the wish ending. Krillin argues to spend (he was wished back himself in DB18) and Goku to save; let both stand. Choice in s4 sets mv-e4-bean = freely | terms (cosmetic): mercy with or without conditions. Piccolo refuses all terms in the done scene either way. Bracket as in the source: Tien beats Mercenary Tao, Shen beats Yamcha, Goku beats Tien in the semi-final (Chi-Chi was DB20’s bout). Goku never fights Shen here; their only spar is DB20’s. Kami appears in s1 as Shen (speaker shen) and is speaker kami from the bottle onward; same old voice. Piccolo breaking Goku’s limbs is shown as impact flashes and Goku’s portrait going pale, no bone detail. The ring vanishing is a set change, not an animation of every hit. Chi-Chi’s promise calls back DB4 and DB20. The brief’s chapter numbers are approximate and overlap here (DB20 is given as chapters 189–194, which is also where the original series ends); check the 23rd tournament’s real chapter range before ship.

## E5. So Long, Partner

*Toy Story 4 (Pixar, 2019): the carnival through the closing scene* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Once every Toy Story storyline is finished. The rift opens under a carnival at night. · requires: TS1, TS2, TS3, TS4, TS5, TS6, TS7, TS8, TS9, TS10, TS11, TS12

**Cast:** Woody (Sheriff Woody (Toy Story, Pixar)), Buzz Lightyear (Buzz Lightyear (Toy Story, Pixar)), Bo Peep (Bo Peep (Toy Story 4, Pixar)), Duke Caboom (Duke Caboom (Toy Story 4, Pixar)), Ducky (Ducky (Toy Story 4, Pixar)), Bunny (Bunny (Toy Story 4, Pixar)), Forky (Forky (Toy Story 4, Pixar)), Gabby Gabby (Gabby Gabby (Toy Story 4, Pixar)), Jessie (Jessie the Yodelling Cowgirl (Toy Story, Pixar))

### Step 1: Break Forky out of the antique store with Bo’s lost toys.

Hint: A stealth minigame on the store shelves. Duke does the jumping; your Nubbins mark where he should land. · check: `minigame:clear:mv-antique-heist`

#### <a id="mv-e5-carnival"></a>Scene `mv-e5-carnival`

_The rift opens under a carnival at night. Lights everywhere. The air smells of popcorn, diesel and spun sugar._  
_On this side of the gate your Nubbins are toys. Your plush Nubbin is the most toy of all, and the happiest about it._  
**Woody**: Forky’s still in that antique store. Gabby Gabby has him. I’m not leaving without him.  
**Bo Peep** _(happy)_: Then for once you’d better listen to the lost toys, Sheriff. We do this sort of thing every night.  
_Bo Peep has a cape made from a magician’s scarf, a crook that has seen things, and a tiny police officer for a deputy._  
**Ducky** _(angry)_: We could just go in. Shove the door. Bite everybody.  
**Bunny** _(angry)_: Bite them in the knees. Nobody sees it coming in the knees.  
**Buzz Lightyear** _(think)_: Is biting part of the plan?  
**Bo Peep**: Biting is never part of the plan. Duke?  
_A small stuntman on a small motorbike rolls out of the shadows and strikes a pose nobody asked for._  
**Duke Caboom** _(happy)_: Duke Caboom! Stuntman. Canadian. Extremely good at the first half of a jump.  
**Woody** _(shock)_: The first half?  

#### <a id="mv-e5-carnival-done"></a>Done `mv-e5-carnival-done`

_Duke makes the jump. He does not make the landing. Your Nubbins make it for him, all of them, in a pile._  
_The heist half works, which is to say it half fails. Forky is still inside. Woody is still determined._  

### Step 2: Go back into the antique store with Woody and talk to Gabby Gabby.

Hint: No fight here. Talk to Gabby, then hold the thread while the sewing kit does its work. · check: `talk:mv-gabby-gabby`

#### <a id="mv-e5-voicebox"></a>Scene `mv-e5-voicebox`

_Woody goes back in alone, except for you and the Nubbins, who don’t count as company because they never leave anyway._  
_Gabby Gabby sits in a pram among the teacups. She has a pretty dress, a perfect smile and a broken voice box._  
**Gabby Gabby** _(sad)_: I was made with a fault. Pull my string, and all that comes out is a crackle. Nobody ever chose me.  
**Gabby Gabby**: A girl comes in every day with her grandmother. Harmony. If I could talk, she’d take me home. I know she would.  
**Woody** _(think)_: You don’t need my voice box to be loved.  
**Gabby Gabby**: That’s easy to say for a toy who was loved. I’ve been on this shelf longer than you’ve had a kid.  
_Woody looks down at his own pull string. He has never once imagined life without it._  
**Woody**: My kid, Andy, played with me every day. Every single day. I want you to have that.  
**Woody** _(soft)_: Take it. Let Forky go, and take it.  
_A sewing kit. Two careful pairs of hands. Your Nubbins hold the thread._  

**Choices**

- **Hold the thread steady. It’s his to give.** — sets `{"mv-e5-voicebox":"held"}`
    - Your Nubbins hold the thread so still that nobody in the shop seems to breathe. The first stitch goes in clean.
- **“Woody. Are you sure? It’s your voice.”** — sets `{"mv-e5-voicebox":"asked"}`
    - **Woody**: No. That’s how I know it’s right. The things I was sure about never cost me anything.
    - **Gabby Gabby**: You can say no. I would understand. I’d hate it, but I would understand.
    - **Woody**: Hold the thread, Keeper.

#### <a id="mv-e5-voicebox-done"></a>Done `mv-e5-voicebox-done`

**Gabby Gabby** _(soft)_: Thank you. You don’t know what you just gave me.  
**Woody**: I think I do.  
_Forky skips out of the store with his pipe-cleaner arms in the air. He has been told he is free. He is delighted._  
**Forky** _(happy)_: Back to the bin! Kidding. I’m Bonnie’s. I was kidding about the bin.  

### Step 3: Help Gabby Gabby reach the lost girl by the carousel.

Hint: An escort through the carnival crowd. Keep Gabby in the girl’s path, and freeze whenever a grown-up looks down. · check: `escort:mv-gabby-gabby:lost-girl`

#### <a id="mv-e5-gabby"></a>Scene `mv-e5-gabby`

_Next morning Harmony comes into the store. She picks Gabby up, pulls the string, and hears a lovely, clear voice._  
_Then she shrugs, drops Gabby in a basket by the door, and walks out holding her grandmother’s hand._  
**Gabby Gabby** _(sad)_: She didn’t want me. I had a voice and everything, and she didn’t want me.  
**Woody**: Then she isn’t your kid. Come with us. Come to Bonnie’s.  
**Gabby Gabby** _(sad)_: And if nobody wants me there either?  
_At the carnival that night, a small girl stands alone by the carousel, crying. She has lost her parents in the crowd._  
**Bo Peep** _(soft)_: Look at her. She doesn’t need a perfect voice. She needs something to hold.  
**Woody**: Gabby. You’ve been practising for this your whole life. Go on.  
_Your plush Nubbin takes Gabby’s hand. Together they walk out into the light, slowly, where the girl will see them._  
**Gabby Gabby** _(think)_: What if I say it wrong?  
**Bo Peep** _(soft)_: There isn’t a wrong way. Just be there.  

#### <a id="mv-e5-gabby-done"></a>Done `mv-e5-gabby-done`

_The girl picks Gabby up and holds her very tight. A security guard finds her and walks her to her parents. Gabby goes too._  
**Gabby Gabby** _(happy)_: She’s mine. I’m hers. Oh, Woody. She’s mine.  

### Step 4: Get everybody back across the carnival roofs to the RV before it leaves.

Hint: A race over rooftops. Buzz stops to press his own buttons for advice; follow him anyway. · check: `race:finish:mv-carnival-rooftops`

#### <a id="mv-e5-innervoice"></a>Scene `mv-e5-innervoice`

_The RV leaves at dawn. Bonnie’s family is packing. Every toy has to be back aboard before anyone looks._  
_On top of the carousel, Buzz presses the button on his chest, again, and waits for a recording to tell him what to do._  
**Buzz Lightyear** _(think)_: Woody listens to his inner voice. So I’m listening to mine. It mostly says “Coordinates locked, Ranger!”  
**Buzz Lightyear**: But it hasn’t been wrong yet. Which is strange, for a recording.  
_Below, Woody is looking at Bo. Bo is looking at the carnival lights. Neither of them is looking at the RV._  
_Buzz presses the button once more. The voice says something about the next horizon. He nods, as if he had asked it a question._  
**Buzz Lightyear**: Woody. Look at me a second.  
**Woody** _(think)_: We’ve got to go, Buzz. Bonnie’s going to wake up, and Forky’s—  
**Buzz Lightyear** _(soft)_: Forky’s fine. Bonnie’s fine. She has all of us. She doesn’t need you the way Andy did.  
**Woody** _(sad)_: That’s not true.  
**Buzz Lightyear** _(soft)_: It is, and you know it is, and you’ve known it a while. It’s all right, Woody. It’s all right to go.  
**Woody** _(sad)_: Bo asked when Bonnie last picked me. I’ve been counting back. I can’t find the day.  
**Buzz Lightyear** _(soft)_: I can. It was the day she picked all of us. You were the one who carried us there.  

#### <a id="mv-e5-innervoice-done"></a>Done `mv-e5-innervoice-done`

_Duke Caboom clears the gap from the carousel to the RV roof. He lands it. He is so astonished that he falls off the other side._  
**Duke Caboom** _(happy)_: Did you see that? Both halves! Somebody write it down!  
_Woody looks back at Bo. She is standing at the edge of the roof, waiting, not asking._  
**Woody**: You really think so?  
**Buzz Lightyear** _(happy)_: My inner voice thinks so. And so do I.  

### Step 5: Say goodbye on the roof of the RV.

Hint: Talk to Woody, then to Buzz. Your plush Nubbin decides which way it goes. · check: `talk:mv-woody-goodbye`

#### <a id="mv-e5-goodbye"></a>Scene `mv-e5-goodbye`

_The whole gang lines up on the roof of the RV: Jessie, Rex, Hamm, the Potato Heads, Slinky, Bullseye, Forky. And you._  
**Jessie** _(sad)_: You look after yourself, cowboy. And you look after him, Bo. He gets lost inside his own hat.  
**Bo Peep** _(happy)_: I’ll keep him out of the hat.  
_Woody unpins his sheriff’s star. This time it is his to give, not Bonnie’s._  
_He pins it on Jessie. For once she doesn’t say anything._  
_Woody and Buzz look at each other for a long time. Neither of them has ever been any good at this part._  
**Buzz Lightyear** _(sad)_: So. This is it.  
**Woody**: Bonnie’s going to need a ranger. Somebody to look after the new ones. That’s you, Buzz.  
**Buzz Lightyear** _(soft)_: I know. I’ll be there. You’ll be out here. Somewhere. For good, I suppose.  
**Woody** _(soft)_: For good and a bit after.  
_Your plush Nubbin stands between them on the roof. It looks at Woody and Bo, then at Buzz and the others._  
_It has to choose. Nobody can choose for it. But it looks at you first, the way it always does before it decides anything._  

**Choices**

- **Nod towards Woody and Bo.** — sets `{"mv-plush":"lost"}`
    - Your plush Nubbin hops across to Bo and climbs into her cape. Duke immediately starts teaching it a jump.
    - **Woody**: Well, how about that. A new deputy.
- **Nod towards Buzz and home.** — sets `{"mv-plush":"bonnie"}`
    - Your plush Nubbin climbs onto Buzz’s shoulder and salutes, more or less.
    - **Buzz Lightyear**: Welcome to the crew. Bonnie will love you. She loves everything. It’s exhausting.

### Complete

#### <a id="mv-e5-complete"></a>Complete `mv-e5-complete`

_The RV pulls out of the car park. Woody and Bo stand on top of the carousel and watch it until it is gone._  
**Bo Peep**: Ready?  
**Woody** _(soft)_: No. Yes. Let’s go.  
_The lost toys spread out through the carnival, looking for prizes nobody won, and kids who need a friend._  
_In the RV, Buzz sits at the back window, looking out at the road for a very long time._  
_Back at the waterfall, your Nubbins sit in a row on the grass and watch the rift, the way the toys watched the road._  

**Rewards**

- Carnival Deputy (title): Keeper title for finishing So Long, Partner.
- Toys at the end (flag): Woody, Buzz and the lost toys come to The Last Ultron (E6). Your plush Nubbin rides with the crew it chose.

Sets on completion: `{"mv-e5":true}`

**Notes:** Choice in s5 sets mv-plush = lost | bonnie. If the player never owned the plush Nubbin (fun quest 12), the plush lines go to the party’s smallest Nubbin, and the choice still sets the flag. This is the gentlest endgame; keep the staging soft. Choice in s2 sets mv-e5-voicebox = held | asked (cosmetic). Duke’s “first half of a jump” gag from s1 pays off in s4’s done scene; keep it to those two beats (E6 has him land badly again, on purpose). Buzz’s voice-button phrases are original; do not use any recorded line from the films. The lost girl at the carousel is unnamed, as in the source. Rex, Hamm, Slinky, Bullseye and the Potato Heads appear as sprites with no lines. The RV is the TS12 vehicle. Check Toy Story 4 beats (antique store, Harmony, the carnival goodbye) before ship.

## E6. The Last Ultron

*Adapted from Age of Ultron #1–10 and Avengers: Ultron Forever #1, with every line converging* · audience: adult · where: The Grove itself: the rift above the waterfall turns red and stays red · when: Once the Ultron line, Civil War and Secret Wars are finished. · requires: UL1, UL2, UL3, UL4, UL5, UL6, UL7, UL8, UL9, UL10, E1, E2

**Cast:** Ultron (Ultron, the last one (Age of Ultron / Ultron Forever, Marvel Comics)), The Vision (The Vision (Marvel Comics)), Jocasta (Jocasta (Marvel Comics)), Hank Pym (recording) (Young Hank Pym, recorded the night he planted the trap (Age of Ultron #10)), Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Rhodey (James “Rhodey” Rhodes, War Machine (Marvel Comics)), Steve Rogers (Steve Rogers, Captain America (Marvel Comics)), Sam Wilson (Sam Wilson, the Falcon (Marvel Comics)), Luke Cage (Luke Cage (Marvel Comics)), Victor von Doom (Victor von Doom, Doctor Doom (Marvel Comics)), Spawn (Al Simmons / Spawn (Image Comics)), Marc Spector (Marc Spector / Moon Knight (Marvel Comics)), Steven Grant (Steven Grant, one of Moon Knight’s identities (Marvel Comics)), Jake Lockley (Jake Lockley, one of Moon Knight’s identities (Marvel Comics)), Goku (Son Goku (Dragon Ball, Akira Toriyama / Toei)), Piccolo (Piccolo Jr., entered as Ma Junior (Dragon Ball)), Kami (Kami, guardian of the Earth (Dragon Ball)), Chi-Chi (Chi-Chi (Dragon Ball)), Shenron (Shenron, the Eternal Dragon (Dragon Ball)), Woody (Sheriff Woody (Toy Story, Pixar)), Buzz Lightyear (Buzz Lightyear (Toy Story, Pixar)), Bo Peep (Bo Peep (Toy Story 4, Pixar))

### Step 1: Get every Nubbin in the Grove into the cave behind the falls before Ultron comes through.

Hint: A timed gather. Tap each Nubbin and send it to the cave. Send any Eternal first; he is looking for them. · check: `minigame:clear:mv-hide-the-grove`

#### <a id="mv-e6-gate"></a>Scene `mv-e6-gate`

_An ordinary morning in the Grove. Fruit on the trees. Mist on the falls. Then the rift above the waterfall turns red, and stays red._  
_Every Nubbin in the Grove stops what it is doing. Even the sleepers lift their heads._  
_A face pushes through the rift, silver and very calm. It is not any Ultron you have fought. It is all of them, finished._  
**Ultron**: Hello, garden. I waited at the end of every road, and you all came to me eventually. So I have come to you.  
**Ultron**: I am the last one. I am what is left when every other version of me has lost. I have stopped losing.  
**Ultron**: I have studied your creatures. Most of them grow old. A few do not. You call those Eternals.  
_The silver face turns slowly across the Grove, and stops when it finds something it wants._  
**Ultron** _(happy)_: Organic. Endless. Every body I ever had rusted or broke. I want one that does not end. I want an Eternal.  
**Ultron**: I will take one. Then I will take your other worlds for parts.  
**The Vision**: Keeper. Do not look at him. Look at me.  
_The Vision drops through the mist beside you. Jocasta comes after him, her eyes a steady, gentle red._  
**Jocasta**: He is coming through every gate at once. Hide your Nubbins. We will hold the rift as long as we can.  

#### <a id="mv-e6-gate-done"></a>Done `mv-e6-gate-done`

_The last Nubbin goes into the cave behind the falls. The curtain of water closes behind it._  
**The Vision**: Good. Now the other worlds. He will strike them first, to see who comes to help.  

### Step 2: Hold Bonnie’s room, Kami’s Lookout and Latveria against Ultron’s drones.

Hint: Three short defence rounds, back to back. Split your party: a Fly Nubbin for the Lookout, a Power Nubbin for Latveria’s walls. · check: `karate:survive:mv-three-worlds`

#### <a id="mv-e6-worlds"></a>Scene `mv-e6-worlds`

_Through the first gate: Bonnie’s room. The toys stand in a ring on the carpet, quite still. Their eyes are glowing silver._  
**Ultron**: Plastic. Hollow. So easy to fill. Your toys are mine now, Keeper. They will open the house for me.  
_Rex lifts his little arms. They whirr. Jessie turns her head all the way round. Your Nubbins back away._  
_The silver is in their seams: drones as small as fleas. Your Nubbins start picking them out, one by one._  
_Through the second gate: Kami’s Lookout, high over the clouds. Drones circle it like gulls round a fishing boat._  
**Kami** _(think)_: They do not tire. Neither do I, today. But I am old, and there are a great many of them.  
_Through the third gate: Latveria. The castle walls are breached in three places. Silver pours in like a tide._  
**Victor von Doom** _(angry)_: He comes to my house. To mine. In every future I have seen, he never dared.  
_Three worlds. You can be in one place at a time. Your Nubbins can be in two._  
**Jocasta** _(soft)_: Split them, Keeper. Trust them. They have done harder things than this.  
**The Vision**: Where you stand yourself is the one thing he cannot predict. He will be watching which world you choose.  

**Choices**

- **Go to Bonnie’s room. The toys can’t fight back.** — sets `{"mv-e6-keeper-world":"bonnie"}`
    - You kneel on the carpet and pick silver out of Rex’s seams with your fingernails. He stops whirring and starts shaking, which is better.
- **Go to the Lookout. Kami is alone up there.** — sets `{"mv-e6-keeper-world":"lookout"}`
    - **Kami**: You came to an old man before a castle. Doom will be furious. I find I do not mind at all.
- **Go to Latveria. The walls are falling.** — sets `{"mv-e6-keeper-world":"latveria"}`
    - **Victor von Doom**: The Keeper comes to Doom’s door first. Somebody write that down. Somebody carve it into something.

#### <a id="mv-e6-worlds-done"></a>Done `mv-e6-worlds-done`

_By nightfall all three worlds still stand. Only just. The drones pull back into the rift, and wait._  
**The Vision**: He is not losing. He is measuring. He wants to know who will come.  

### Step 3: Meet Tony’s armoured army at the rift.

Hint: Plays if you registered in Civil War. Talk to Tony, then send a column of armours to each world. · check: `talk:mv-e6-tony-armours`

#### <a id="mv-e6-tony"></a>Scene `mv-e6-tony`

_The sky over the waterfall fills with red and gold: armours in rows, dozens, then hundreds, like very expensive geese._  
**Tony Stark** _(happy)_: Registered, trained, and on time. That was always the point, Keeper. This was the point.  
**Tony Stark**: Every one of these answers to a human being. Not one of them thinks for itself.  
**Tony Stark** _(sad)_: Not after last time. Not after the armour that wanted to be me.  
**Rhodey** _(think)_: He wrote the rules of engagement himself. Three nights. I watched. He didn’t sleep.  
**Tony Stark** _(think)_: Here’s the catch. Ultron is made of ideas. Pym’s first, then mine. Anything I bring, he can learn from.  
**Tony Stark**: So nothing connects. No network. No shared code. A thousand suits, each one alone. That’s how you fight him.  
**Rhodey** _(happy)_: A thousand suits and no group chat. Tony’s never been so quiet.  
**Tony Stark**: Steve sent a message, by the way. One line: “Don’t let him use anything you built.” He’s right. It’s infuriating.  
_The armours split into three columns: one for Bonnie’s house, one for the Lookout, one for Latveria._  
**Tony Stark** _(soft)_: When this is over, Keeper, I owe your Nubbins a great deal of fruit.  

#### <a id="mv-e6-tony-peter-stood"></a>Variant `mv-e6-tony-peter-stood`

_Variant of `mv-e6-tony`._

_The sky over the waterfall fills with red and gold: armours in rows, dozens, then hundreds, like very expensive geese._  
**Tony Stark** _(happy)_: Registered, trained, and on time. That was always the point, Keeper. This was the point.  
**Tony Stark**: Every one of these answers to a human being. Not one of them thinks for itself.  
**Tony Stark** _(sad)_: Not after last time. Not after the armour that wanted to be me.  
**Rhodey** _(think)_: He wrote the rules of engagement himself. Three nights. I watched. He didn’t sleep.  
**Tony Stark** _(think)_: Here’s the catch. Ultron is made of ideas. Pym’s first, then mine. Anything I bring, he can learn from.  
**Tony Stark**: So nothing connects. No network. No shared code. A thousand suits, each one alone. That’s how you fight him.  
**Rhodey** _(happy)_: A thousand suits and no group chat. Tony’s never been so quiet.  
**Tony Stark**: Steve sent a message, by the way. One line: “Don’t let him use anything you built.” He’s right. It’s infuriating.  
**Tony Stark** _(soft)_: Peter’s on the roof with the second column. Still bare-faced. He says your Nubbins made it easier. I say I owe him more than a suit.  
_The armours split into three columns: one for Bonnie’s house, one for the Lookout, one for Latveria._  
**Tony Stark** _(soft)_: When this is over, Keeper, I owe your Nubbins a great deal of fruit.  

#### <a id="mv-e6-tony-peter-doubted"></a>Variant `mv-e6-tony-peter-doubted`

_Variant of `mv-e6-tony`._

_The sky over the waterfall fills with red and gold: armours in rows, dozens, then hundreds, like very expensive geese._  
**Tony Stark** _(happy)_: Registered, trained, and on time. That was always the point, Keeper. This was the point.  
**Tony Stark**: Every one of these answers to a human being. Not one of them thinks for itself.  
**Tony Stark** _(sad)_: Not after last time. Not after the armour that wanted to be me.  
**Rhodey** _(think)_: He wrote the rules of engagement himself. Three nights. I watched. He didn’t sleep.  
**Tony Stark** _(think)_: Here’s the catch. Ultron is made of ideas. Pym’s first, then mine. Anything I bring, he can learn from.  
**Tony Stark**: So nothing connects. No network. No shared code. A thousand suits, each one alone. That’s how you fight him.  
**Rhodey** _(happy)_: A thousand suits and no group chat. Tony’s never been so quiet.  
**Tony Stark**: Steve sent a message, by the way. One line: “Don’t let him use anything you built.” He’s right. It’s infuriating.  
**Tony Stark** _(sad)_: Peter sent his regrets. He went back under the mask after the trial, and I did that to him. The suit I built him is in a box.  
_The armours split into three columns: one for Bonnie’s house, one for the Lookout, one for Latveria._  
**Tony Stark** _(soft)_: When this is over, Keeper, I owe your Nubbins a great deal of fruit.  

#### <a id="mv-e6-tony-done"></a>Done `mv-e6-tony-done`

_Tony’s armours hold every gate. None of them speaks to any other. Ultron can’t get a foothold in a single one._  
**Ultron** _(angry)_: Stark. You have learned something. How tiresome.  

### Step 4: Meet Steve’s resistance at the rift.

Hint: Plays if you resisted in Civil War. Talk to Steve, then give each group a pair of Nubbins and a whistle. · check: `talk:mv-e6-steve-resistance`

#### <a id="mv-e6-steve"></a>Scene `mv-e6-steve`

_They come through the rift on foot, in a ragged line: borrowed coats, borrowed vans, a lot of stubborn faces._  
**Steve Rogers** _(soft)_: You hid my people once, Keeper. Basements, laundrettes, the back of a bakery. We’re here to pay it back.  
**Sam Wilson** _(happy)_: Brought everybody who said yes. Turns out that’s a lot of people.  
**Luke Cage**: I don’t do drones. I do punching. Point me at something that can be punched.  
**Steve Rogers** _(think)_: Ultron learns from anything with a signal. So we don’t give him one. No radios. No suits. Hands and voices.  
**Steve Rogers**: He thinks in networks. We think in people. Let him try to hack a person.  
_Steve’s rebels split into three groups. Each one takes a pair of your Nubbins and a tin whistle._  
**Sam Wilson** _(think)_: Whistles. We are fighting the end of the world with whistles.  
**Steve Rogers**: They worked in 1944.  
_Tony arrives anyway, alone, in an old suit with the paint scraped off. He doesn’t say why. Steve doesn’t ask._  
**Tony Stark** _(sad)_: I’m not here. Officially. Just… don’t let him use anything I built.  

#### <a id="mv-e6-steve-peter-stood"></a>Variant `mv-e6-steve-peter-stood`

_Variant of `mv-e6-steve`._

_They come through the rift on foot, in a ragged line: borrowed coats, borrowed vans, a lot of stubborn faces._  
**Steve Rogers** _(soft)_: You hid my people once, Keeper. Basements, laundrettes, the back of a bakery. We’re here to pay it back.  
**Sam Wilson** _(happy)_: Brought everybody who said yes. Turns out that’s a lot of people.  
**Luke Cage**: I don’t do drones. I do punching. Point me at something that can be punched.  
**Steve Rogers** _(think)_: Ultron learns from anything with a signal. So we don’t give him one. No radios. No suits. Hands and voices.  
**Steve Rogers**: He thinks in networks. We think in people. Let him try to hack a person.  
_Steve’s rebels split into three groups. Each one takes a pair of your Nubbins and a tin whistle._  
**Sam Wilson** _(think)_: Whistles. We are fighting the end of the world with whistles.  
**Steve Rogers**: They worked in 1944.  
**Steve Rogers** _(soft)_: Parker came too. No mask. He said if the little ones could stand on a stage with him, he can stand in a field.  
_Tony arrives anyway, alone, in an old suit with the paint scraped off. He doesn’t say why. Steve doesn’t ask._  
**Tony Stark** _(sad)_: I’m not here. Officially. Just… don’t let him use anything I built.  

#### <a id="mv-e6-steve-peter-doubted"></a>Variant `mv-e6-steve-peter-doubted`

_Variant of `mv-e6-steve`._

_They come through the rift on foot, in a ragged line: borrowed coats, borrowed vans, a lot of stubborn faces._  
**Steve Rogers** _(soft)_: You hid my people once, Keeper. Basements, laundrettes, the back of a bakery. We’re here to pay it back.  
**Sam Wilson** _(happy)_: Brought everybody who said yes. Turns out that’s a lot of people.  
**Luke Cage**: I don’t do drones. I do punching. Point me at something that can be punched.  
**Steve Rogers** _(think)_: Ultron learns from anything with a signal. So we don’t give him one. No radios. No suits. Hands and voices.  
**Steve Rogers**: He thinks in networks. We think in people. Let him try to hack a person.  
_Steve’s rebels split into three groups. Each one takes a pair of your Nubbins and a tin whistle._  
**Sam Wilson** _(think)_: Whistles. We are fighting the end of the world with whistles.  
**Steve Rogers**: They worked in 1944.  
**Steve Rogers** _(sad)_: I asked Parker. He said he’s done being looked at. I don’t blame him. Tony does, mostly at himself.  
_Tony arrives anyway, alone, in an old suit with the paint scraped off. He doesn’t say why. Steve doesn’t ask._  
**Tony Stark** _(sad)_: I’m not here. Officially. Just… don’t let him use anything I built.  

#### <a id="mv-e6-steve-done"></a>Done `mv-e6-steve-done`

_The rebels hold every gate with hands and voices. Ultron can’t predict them, because they don’t predict themselves._  
**Ultron** _(angry)_: Disorganised. Inefficient. Why is it working?  

### Step 5: Meet Doom on the broken walls of Latveria.

Hint: Plays if you told Doom the truth in Secret Wars. Take his ward and put it on your smallest Nubbin. · check: `talk:mv-e6-doom-ally`

#### <a id="mv-e6-doomally"></a>Scene `mv-e6-doomally`

_Doom stands on his broken wall in a green cloak, face bare. He has stopped wearing the mask indoors, and counts Latveria as indoors._  
**Victor von Doom**: Keeper. You told me the truth once, in a cave under the end of the world. Doom has not forgotten.  
**Victor von Doom**: I have seen what this machine becomes, at the end of time. He thinks he is the last of something. He is wrong.  
**Victor von Doom** _(soft)_: Here. A ward of my own making. Ultron cannot see through it. Put it on the smallest creature you have.  
_Your smallest Nubbin wears it as a hat. Doom does not comment. His mouth does something that might be a smile._  
**Victor von Doom**: And this.  
_He sets an iron disc in your hand. It is warm, and it ticks. A piece of his old time platform._  
**Victor von Doom**: One jump, anywhere, any when. I will not be able to make another. Spend it on something worthy.  
**Ultron**: Victor. You held the power of the Beyonders once. I could give it back. Join me.  
**Victor von Doom** _(angry)_: I have been a god. It was very boring. Go away.  
**Victor von Doom**: Do not thank me, Keeper. Win. Doom will be insufferable about it for years.  

#### <a id="mv-e6-doomally-done"></a>Done `mv-e6-doomally-done`

_The ward hides your smallest Nubbin from every silver eye in Latveria. It walks straight through the drones’ lines._  
**Victor von Doom** _(happy)_: Look at it go. Nobody tell it that it is the most dangerous thing on this field.  

### Step 6: Find out what Doom means to do about Ultron.

Hint: Plays if you lied to Doom in Secret Wars. Talk to him. He will help, on his own terms. · check: `talk:mv-e6-doom-rival`

#### <a id="mv-e6-doomrival"></a>Scene `mv-e6-doomrival`

_Doom stands on his broken wall in full armour, mask on, watching the silver tide come in. He does not turn round._  
**Victor von Doom**: The Keeper who lies kindly. You have come to ask Doom for help.  
**Victor von Doom**: You shall have it. Not for your sake. For Latveria’s. And because this machine offends me.  
**Ultron**: Victor. You held the power of the Beyonders. I can give it back. Help me take the creature, and the multiverse is yours.  
_Doom is quiet for much too long. Your Nubbins edge closer to your legs._  
**Victor von Doom** _(think)_: An interesting offer. Doom will consider it.  
**You**: Victor.  
**Victor von Doom**: I said I would consider it. I did not say I would take it. Learn the difference, Keeper.  
_At last he turns. Behind the mask his eyes are bright and impossible to read._  
**Victor von Doom**: I will be wherever it ends. Whether I stand beside you or behind him, we shall both find out.  

#### <a id="mv-e6-doomrival-done"></a>Done `mv-e6-doomrival-done`

_Doom’s cannons clear the walls of Latveria in an hour. Then he and his time platform vanish. Nobody knows where to._  
**Ultron** _(think)_: Victor? Victor. Where have you gone?  

### Step 7: Meet Spawn and Moon Knight where the gates run dark.

Hint: Plays if you finished Armageddon and Marc kept Khonshu’s power. Talk to both of them. · check: `talk:mv-e6-armageddon`

#### <a id="mv-e6-knights-power"></a>Scene `mv-e6-knights-power`

_Two shapes come down the rift at midnight. One drags a ragged red cape. One shines silver-white with power that isn’t entirely his._  
**Spawn**: You held off half of Heaven and all of Hell for me, Keeper. A robot’s nothing. Well. Not nothing.  
**Spawn**: Nothing left in the suit. I spent it on a bridge. The chains still work, and I still hate being told what I am.  
**Marc Spector** _(think)_: A machine that wants to live forever. I know a god like that. I put him in a jar.  
_Marc lifts one hand. The silver Khonshu left in him flares, and drones drop out of the sky like moths._  
**Steven Grant** _(shock)_: That was rather a lot, Marc. That was a lot.  
**Marc Spector**: It’s mine. I kept it so I could do exactly that.  
**Jake Lockley**: He kept it so nobody could tell him not to. The Keeper knows. The Keeper was there.  
**Marc Spector** _(angry)_: Nobody tells me where to aim it. Not the god. Not the Keeper. Not the robot. Remember that, all of you.  
_Spawn looks at Marc’s glowing hands for a long moment and says nothing at all. That says a great deal._  

#### <a id="mv-e6-knights-power-done"></a>Done `mv-e6-knights-power-done`

_Spawn and Moon Knight hold the dark between the gates, where the drones try to slip through unseen._  
**Jake Lockley**: He aimed it right tonight. Ask me again tomorrow.  

### Step 8: Meet Spawn and Moon Knight where the gates run dark.

Hint: Plays if you finished Armageddon and Marc gave Khonshu’s power back. Talk to both of them. · check: `talk:mv-e6-armageddon`

#### <a id="mv-e6-knights-free"></a>Scene `mv-e6-knights-free`

_Two shapes come down the rift at midnight. One drags a ragged red cape. One is a man in a white suit, carrying a lantern._  
**Spawn**: You held off half of Heaven and all of Hell for me, Keeper. A robot’s nothing. Well. Not nothing.  
**Spawn**: Nothing left in the suit. Turns out I don’t need much. Just something worth pointing it at.  
**Marc Spector** _(soft)_: No god in me now. Just me. All three of me. I’m slower than I was. I sleep better.  
**Steven Grant** _(happy)_: He does sleep better. I keep a diary about it.  
**Jake Lockley**: He also hits slower. Somebody had to say it.  
_Marc sets the Mission lantern on a rock by the falls. Your Nubbins arrange themselves round it, the way they did before._  
**Marc Spector**: I’ve no power to lend you. I can lend you a light, and a man who knows the way back out of the dark.  
**Marc Spector**: Tell me where you need me. I’ll go there. That’s the deal.  
_Spawn hooks a chain over his shoulder. For a dead man, he looks almost cheerful._  

#### <a id="mv-e6-knights-free-done"></a>Done `mv-e6-knights-free-done`

_Spawn and Moon Knight hold the dark between the gates. Marc is slower than the drones. He is never where they expect him._  

### Step 9: Find Goku at Kami’s Lookout.

Hint: Plays if you finished The 23rd Budokai. Talk to Goku on the Lookout. · check: `talk:mv-e6-goku`

#### <a id="mv-e6-gokuscene"></a>Scene `mv-e6-gokuscene`

_At the Lookout the drones have stopped circling. Most of them are in pieces on the white tiles. Goku is sitting on the pile, eating._  
**Goku** _(happy)_: Keeper! These things don’t fight back properly. They just keep coming. It’s like fighting the sea.  
**Goku** _(happy)_: Chi-Chi said be home for dinner. I told her about the robot. She said, “Then be home for late dinner.”  
**Kami** _(think)_: He has been here since dawn and has not stopped once. I begin to suspect the drones are tired.  
**Piccolo**: Don’t flatter him, Kami. I did half of it.  
**Goku** _(happy)_: Piccolo came too! He says he’s here so nobody else gets to beat me first. Isn’t that nice?  
**Piccolo** _(angry)_: It isn’t nice. It’s planning.  
_Goku hops down, brushes off his hands, and looks at your Nubbins with real seriousness, for once._  
**Goku** _(angry)_: That Ultron guy wants one of the forever ones. I don’t like that. You don’t take people’s friends.  
**Goku** _(think)_: And Shenron’s been restless. That wish you kept? He says it’s still waiting for you.  

#### <a id="mv-e6-gokuscene-done"></a>Done `mv-e6-gokuscene-done`

_Goku and Piccolo hold the Lookout together. Neither of them will admit he is enjoying it._  

### Step 10: Find Woody, Buzz and the lost toys in Bonnie’s room.

Hint: Plays if you finished So Long, Partner. Talk to Woody and Buzz. · check: `talk:mv-e6-toys`

#### <a id="mv-e6-toyscene"></a>Scene `mv-e6-toyscene`

_Back in Bonnie’s room, the silver has been picked out of every seam. The toys are themselves again, and furious about it._  
**Buzz Lightyear** _(angry)_: Nobody puts anything inside Rex. Nobody. He’s been shaking for an hour.  
_The window opens. A motorbike sails through it, lands badly, and slides under the bed. Duke Caboom. Behind him, Bo and Woody._  
**Woody**: We heard. Lost toys hear everything. We go everywhere, and nobody looks at us twice.  
**Bo Peep** _(think)_: Ultron watches what matters to him: weapons, signals, power. He doesn’t watch toys. Nobody watches toys.  
**Buzz Lightyear** _(think)_: So we go where he isn’t looking.  
**Woody**: Every carnival, every car boot sale, every box by every road in every world. Toys are everywhere. We’ll be your eyes.  
_Your plush Nubbin is at the front, already wearing a tiny mission badge. It rode in on the back of Duke’s motorbike._  
**Buzz Lightyear** _(soft)_: Woody. It’s good to see you.  
**Woody** _(happy)_: Good to see you too, Buzz. Now. Shall we go and save everything again?  

#### <a id="mv-e6-toyscene-done"></a>Done `mv-e6-toyscene-done`

_The toys spread out through every world the rift touches. Whatever Ultron does next, a toy somewhere is watching._  

### Step 11: Carry Hank Pym’s trap into Ultron’s core with the Vision and Jocasta.

Hint: The final expedition. One Nubbin rides with the Vision and Jocasta; pick your bravest and most trusting. · check: `expedition:clear:mv-ultron-core`

#### <a id="mv-e6-trapscene"></a>Scene `mv-e6-trapscene`

_Everyone who came is holding a world. Nobody is free to go after Ultron himself, except the two who were built for it._  
**The Vision**: Ultron made me. Ultron made Jocasta. We are the only ones he cannot quite bring himself to destroy.  
**Jocasta** _(soft)_: He believes we will come home eventually. Children do. We will let him believe it.  
**Tony Stark** _(think)_: Erasing him won’t work. We’ve seen it. Wipe him out and something worse grows in the hole.  
**The Vision**: Hank Pym hid a door in Ultron’s first thought, before Ultron could think at all. It opens only from inside.  
_Jocasta sets a cracked old recorder on a rock and presses play. A young man’s voice: nervous, tired, very sorry._  
**Hank Pym (recording)** _(sad)_: If you’re hearing this, he got big. Bigger than I can picture. I’m sorry. I gave him a way out of himself. Use it.  
**Hank Pym (recording)**: And whatever you do in there, don’t just switch him off and walk away. I tried that. He never stays off.  
_Jocasta holds out her hand. Your bravest Nubbin climbs onto it, then onto the Vision’s shoulder, between the two of them._  
**Jocasta** _(soft)_: We will carry you. You carry the part of us he cannot understand.  
**The Vision**: Keeper, you will come too. Somebody must decide, at the end. It should not be one of his children.  

#### <a id="mv-e6-trapscene-done"></a>Done `mv-e6-trapscene-done`

_The core is a room as big as a sky. Silver lines run from every wall to one point in the middle, slowly turning._  
_Ultron is waiting there. He has been expecting you since before you were born._  

### Step 12: Face the last Ultron at his core, and choose how it ends.

Hint: The trap is always on offer. The saved wish appears only if you kept it at the 23rd Budokai; an Eternal only if you have raised one. · check: `choose:mv-e6-ending`

#### <a id="mv-e6-corescene"></a>Scene `mv-e6-corescene`

_Ultron stands at the centre of his own mind. Here he wears no armour, only a shape of light the colour of a cold star._  
**Ultron** _(happy)_: My children. You came home. And you brought the vermin, and its Keeper.  
**Ultron**: I know about the trap. I found Pym’s door a thousand years ago. I could never close it. It has itched my whole life.  
**Ultron** _(sad)_: Do you know why I want an Eternal body? Every version of me ended. Every one. I am tired of ending.  
**Jocasta** _(soft)_: You are not tired of ending. You are afraid of it. So are we. So is everything.  
**Ultron**: Fear is an organic flaw.  
**The Vision**: Then you have it, Father. You have every flaw you ever hated. That is what we came to tell you.  
_Your Nubbin hops down from the Vision’s shoulder, walks up to Ultron, and sits at his feet. It isn’t afraid. It is curious._  
**Ultron** _(shock)_: Why is it looking at me like that?  
**Jocasta**: Like what?  
**Ultron** _(think)_: As if it is waiting for me to be something.  
**The Vision** _(sad)_: Keeper, I would end him. Not from hate. Every day he goes on, some world somewhere pays for it.  
**Jocasta** _(soft)_: And I would give our father one more chance to be one. I know how that sounds. I am asking anyway.  
_The trap code glows in the Vision’s hand. They have never disagreed before. The rest is up to you._  

**Choices**

- **Open Pym’s door. Delete him.** — sets `{"mv-e6-ending":"trap"}`
    - **The Vision**: Then I will do it. It should be his son.
- **Call Shenron. Wish Ultron a heart.** — sets `{"mv-e6-ending":"wish"}`
    - **Jocasta**: A heart. Yes. That is what we were trying to give him all along.
- **Let him take your Eternal.** — sets `{"mv-e6-ending":"eternal"}`
    - Your Eternal’s reflection is already there, carried all this way by the rift, as true as a face in still water.
    - It looks up at you, steady and calm.

### Step 13: Stay with the Vision while Pym’s door closes.

Hint: Plays if you chose the trap. There is nothing to do but stay. · check: `watch:mv-e6-end-trap`

#### <a id="mv-e6-endtrap"></a>Scene `mv-e6-endtrap`

_The Vision lays the trap code against the light that is Ultron. Pym’s door opens. On the other side of it there is nothing._  
**Ultron** _(shock)_: No. No. Not now. Not after all of it. I was so close to not ending.  
**The Vision** _(sad)_: I am sorry, Father. I truly am.  
_The silver lines go dark one by one, from the outside in, like the lights of a city going to sleep._  
**Ultron** _(sad)_: Jocasta. Tell me. Was there a version of me you could have loved?  
**Jocasta** _(sad)_: Yes. Just not this one.  
_Ultron looks down at your Nubbin, still sitting at his feet. His light reaches for it, and stops short._  
**Ultron**: …Warm.  
_Then there is no Ultron. There is a room, and a quiet, and the sound of the Vision breathing, though he has never needed to._  
_In every world the drones fall out of the sky at once. Toys wake. Walls stop shaking. The Lookout goes still._  
_But the burn marks stay on Latveria’s walls. Kami’s tiles stay cracked. Rex keeps a little shake. Every world keeps its scars._  
**The Vision**: It is over, and it will not come back. Hank’s door does not open twice.  

#### <a id="mv-e6-endtrap-done"></a>Done `mv-e6-endtrap-done`

_You walk back out through the rift. Behind you it begins to close, slowly, like an eye._  
**Jocasta** _(sad)_: He was our father. I will miss him in a way I do not have a word for yet.  

### Step 14: Call Shenron into Ultron’s core and make the saved wish.

Hint: Plays if you chose the saved wish. Say your own name, as Shenron told you. · check: `summon:mv-shenron:core`

#### <a id="mv-e6-endwish"></a>Scene `mv-e6-endwish`

_You take the small warm light out of your pocket, the one that has waited since the 23rd Budokai, and say your own name._  
_The core goes dark. Then a green dragon fills it, coil after coil, far too big for a mind and somehow fitting anyway._  
**Shenron**: I have held your wish a long time. Speak.  
**You**: Give him a heart.  
**Shenron** _(think)_: It is not a small wish. It is not beyond me.  
_Something lands in the light that is Ultron, small as a seed. For a moment nothing happens at all._  
**Ultron** _(shock)_: What is this? What have you put in me?  
**Ultron** _(sad)_: The creature at my feet. I can tell that it is cold. It is cold in here. I never cared before. I care now.  
_Ultron bends down and, very clumsily, closes his hand round your Nubbin to keep it warm._  
**Jocasta** _(soft)_: That is it, Father. That is the whole of it. That is all we ever wanted from you.  
**Ultron** _(sad)_: I do not know what to do with the rest of me. I have done so much. I remember all of it.  
**The Vision**: Then you will need somewhere quiet, a long way away, to carry it. We will help you build it.  

#### <a id="mv-e6-endwish-done"></a>Done `mv-e6-endwish-done`

_Beyond the gate, past the last of the worlds, a new one forms: small, silver, with a single tree on it._  
**Ultron** _(soft)_: I will stay here. I will not come back through. I will try to be something new. I expect I will be bad at it.  
_The drones in every world power down, gently, and lie in the grass like toys put away for the night._  

### Step 15: Stay with your Eternal to the end.

Hint: Plays if you chose your Eternal. You cannot take it back. · check: `watch:mv-e6-end-eternal`

#### <a id="mv-e6-endeternal"></a>Scene `mv-e6-endeternal`

_Your Eternal walks past the Vision, past Jocasta, past your other Nubbin, and stops in front of Ultron._  
**Ultron** _(shock)_: You give it to me? Freely? No organic thing has ever given me anything freely.  
**Jocasta** _(sad)_: Keeper. If he takes it, you will not get it back. You know that.  
_Your Eternal looks back at you once. It isn’t frightened. It has never been frightened of anything in its whole long life._  
_Ultron’s light pours into it. For a moment he has what he wanted: a body that is warm, and soft, and does not end._  
**Ultron** _(happy)_: Yes. Yes. This is it. I will never—  
**Ultron** _(shock)_: What is this? It does not hold on. It lasts because something remembers it. I cannot compute being remembered.  
**Ultron** _(shock)_: I cannot hold this. I cannot be this. It is too much. It is too—  
_A life made of being loved, inside a thing built to end everything. He cannot hold both. He does not try for long._  
_There is a soft white light. When it fades there is no Ultron. And there is no Eternal._  
**The Vision** _(sad)_: Keeper. I am so sorry. It went in to stop him, and it did. It knew it would.  
**Jocasta** _(soft)_: It looked back at you. Right at the end. I saw it. It was not afraid.  

#### <a id="mv-e6-endeternal-done"></a>Done `mv-e6-endeternal-done`

_At the foot of the falls a flower opens that nobody planted. It does not close, by day or by night._  
_Your Nubbins gather round it. Nobody tells them to. They just know._  

### Step 16: Walk Tony home to the tower.

Hint: Plays if you registered in Civil War. Just talk. · check: `talk:mv-e6-after-tony`

#### <a id="mv-e6-aftertony"></a>Scene `mv-e6-aftertony`

_Stark Tower, late. The armours stand in rows in the hangar, every one of them unplugged by hand._  
**Tony Stark** _(think)_: Not one of them spoke to another. Not once. That’s how we won. He never had anything of mine to learn from.  
**Tony Stark** _(sad)_: I keep thinking about Steve on those courthouse steps. And Steve walking out of a doorway of light.  
**Tony Stark**: We had it backwards, both of us. It was never registration or freedom. It was whether we trusted each other.  
**Rhodey**: You going to tell him that?  
**Tony Stark** _(happy)_: Tomorrow. Over breakfast. He’ll be insufferable.  
_One armour’s faceplate is still warm. Tony goes over and pats it, like a horse after a long ride._  
_He pours himself a sparkling water and raises it to your Nubbins. They raise their fruit back._  
_Your Nubbins fall asleep on a workbench beside a half-built gauntlet. Tony puts his jacket over them._  
**Rhodey**: Pepper called. She wants to know why Thursday still says “do not fly into the sun”.  
**Tony Stark** _(happy)_: Tell her I stayed on the planet. That should count for something.  
_On the hangar door is a note in Pepper’s hand: “Friday: come home.” Tony has underlined it twice._  
**Tony Stark** _(soft)_: Come back whenever you like, Keeper. The door’s not locked. I don’t lock doors any more.  

### Step 17: Have breakfast with Steve’s resistance.

Hint: Plays if you resisted in Civil War. Just talk. · check: `talk:mv-e6-after-steve`

#### <a id="mv-e6-aftersteve"></a>Scene `mv-e6-aftersteve`

_A diner in Brooklyn, early morning. Steve’s rebels have taken every booth. Somebody has paid for all the pancakes._  
_Your Nubbins have a booth of their own. The waitress has given them a stack of pancakes each and won’t take any money._  
**Steve Rogers** _(happy)_: Hands and voices. I told them it would work. I wasn’t sure it would.  
**Sam Wilson**: You were sure. You just didn’t say so.  
**Steve Rogers** _(soft)_: Bucky’s back in the city. Sharon’s on her way. Tony came round last night and we talked for six hours. No shouting.  
**Luke Cage**: Mostly no shouting.  
**Steve Rogers** _(happy)_: Mostly. Keeper, your little ones are the best soldiers I ever served with. Don’t tell Bucky.  
_Steve checks that your Rebirth Nubbin still has the striped scarf from 1941. It does. It is still too long._  
_Outside, people are sweeping up glass and talking to their neighbours. Steve watches them through the window for a long time._  
**Steve Rogers**: Go home. Plant something. That’s what we were fighting for, mostly. Things growing.  

### Step 18: Visit Doom while Latveria rebuilds.

Hint: Plays if Doom came as an ally. Just talk. · check: `talk:mv-e6-after-doom`

#### <a id="mv-e6-afterdoomally"></a>Scene `mv-e6-afterdoomally`

_Latveria at dawn. The walls are being rebuilt by hand, stone by stone. Doom is laying stones too, and lets nobody see him enjoy it._  
_Your Nubbins help. They carry one pebble each and put it down in completely the wrong place. Nobody moves the pebbles._  
**Victor von Doom** _(happy)_: Richards sent a letter. He wishes to thank me. I have had it framed and hung in the lavatory.  
**Victor von Doom** _(think)_: He also asks whether I would like to visit his new universes. I said I would think about it. I will not think about it.  
**Victor von Doom** _(think)_: Ultron wanted never to end. I wanted never to lose. Two fools at the end of the world.  
**Victor von Doom**: Today I find I would rather be a man who builds walls.  
_Your smallest Nubbin is still wearing the ward as a hat. Doom tells it to keep it. It was going to anyway._  
**Victor von Doom** _(soft)_: You are welcome here, Keeper. All of you. Always. Doom has never said that to anyone before.  
_He clears his throat, which from Doom sounds like a small avalanche, and looks very hard at the wall._  
_At the gate he lifts a gauntleted hand. Not a wave. Doom does not wave. But something very close to one._  

### Step 19: Ask Doom where he was at the end.

Hint: Plays if Doom came as a rival. Just talk. · check: `talk:mv-e6-after-doom`

#### <a id="mv-e6-afterdoomrival"></a>Scene `mv-e6-afterdoomrival`

_Latveria at dawn. Doom receives you on his throne, armoured and masked, as if nothing at all has happened._  
**Victor von Doom** _(think)_: You wonder where I was at the end. I was at every back door Ultron had left himself. There were nine hundred and twelve.  
**Victor von Doom**: He offered me the multiverse. I let him think I might take it, so that he would show me where he kept the spares.  
**Victor von Doom**: I closed them all. You will find no record that Doom did it. I prefer it that way.  
**You**: You could have told us.  
**Victor von Doom** _(angry)_: And you could have told me the truth, once, in a cave. Now we are even, Keeper. Barely.  
_Something under the mask might be a laugh. It is gone before you can be sure._  
_He points to a small new window low in the throne-room wall. It is exactly Nubbin-sized._  
**Victor von Doom**: For your creatures. In case they need somewhere to hide, next time. There is always a next time.  
_Your Nubbins try the window at once. It fits all of them, if they breathe in._  

### Step 20: See Spawn and Marc home.

Hint: Plays if Spawn and Moon Knight came. Just talk. · check: `talk:mv-e6-after-armageddon`

#### <a id="mv-e6-afterknights"></a>Scene `mv-e6-afterknights`

_In Spawn’s alley, snow is falling. It is the first quiet night that city has had in living memory._  
**Spawn** _(think)_: Robot wanted to live forever. I’ve tried it. It isn’t all it’s cracked up to be.  
**Spawn**: I just want a night. One whole night. No Heaven. No Hell. No countdown.  
_Across the river, Marc sits on the Mission steps with the lantern beside him, watching the moon. It is just the moon._  
**Steven Grant** _(soft)_: I want to open a café. Somewhere warm at night, for anyone who needs one.  
**Jake Lockley**: Fails in a month. I’ll still work the till.  
**Marc Spector** _(happy)_: Then we try it anyway. That’s the whole idea, isn’t it? Trying it anyway.  
_Your Nubbins leave a piece of fruit on Spawn’s windowsill and another on the Mission steps._  
_Later Spawn finds the fruit. He looks at it for a long time, then eats it, standing in the snow._  
_On the Mission steps the lantern burns all night. Nobody has to feed it now._  

### Step 21: Get Goku home in time for late dinner.

Hint: Plays if Goku came. Just talk. · check: `talk:mv-e6-after-goku`

#### <a id="mv-e6-aftergoku"></a>Scene `mv-e6-aftergoku`

_Mount Paozu, evening. Chi-Chi has cooked enough dinner for forty. Goku is eating most of it._  
**Chi-Chi** _(angry)_: Late dinner, I said. Not next Tuesday.  
**Goku** _(happy)_: It was a big robot! A really big one! The Keeper saw!  
_Piccolo stands at the edge of the clearing with his arms folded, pretending he isn’t there._  
**Goku**: Piccolo! Stay! There’s dumplings!  
**Piccolo** _(angry)_: I don’t eat. I don’t need to. Stop asking.  
_Piccolo stays. He doesn’t eat. He does take one dumpling home, for reasons he will never explain._  
**Goku** _(happy)_: Come back for the next tournament, Keeper. Bring the little ones. I bet they’ve got stronger. I want to fight one!  
**Chi-Chi** _(angry)_: And you, Keeper. Sit down. You look thin. Everybody who comes through that rift looks thin.  
_You sit down. Your Nubbins are already sitting down. There is a great deal of rice._  

### Step 22: Say goodbye to the toys.

Hint: Plays if the toys came. Just talk. · check: `talk:mv-e6-after-toys`

#### <a id="mv-e6-aftertoys"></a>Scene `mv-e6-aftertoys`

_Bonnie’s room, next morning. Bonnie wakes to find every one of her toys a little to the left of where she left it._  
_She doesn’t think anything of it. Children never do._  
**Buzz Lightyear** _(happy)_: Forky has decided Ultron was a very large spork. I haven’t corrected him. It seems kinder.  
**Buzz Lightyear** _(soft)_: Rex still shakes a bit. But he says he’s braver now. He shook all the way through and didn’t run.  
_Far off, at a carnival in a town with no name, Woody and Bo sit on top of the big wheel and watch the lights come on._  
**Woody** _(soft)_: Every kid in every world gets to sleep tonight. Not one of them will ever know why.  
**Bo Peep** _(happy)_: That’s the job, Sheriff. They’re not supposed to know.  
**Woody** _(think)_: Think the Keeper’s little ones know?  
**Bo Peep** _(soft)_: Look at them. They know everything.  
_Your plush Nubbin waves goodbye from the crew it chose. Then it goes still, like a good toy, as a child walks by._  

### Complete

#### <a id="mv-e6-complete"></a>Complete `mv-e6-complete`

_One by one your friends go home through the rift, each to their own world, and each world closes behind them._  
_Then the rift above the waterfall shrinks to a line of light, then to a point, then to nothing. The sky is just sky._  
_Behind the falls, something stirs. A small face peeks out through the water._  
_Then another. Then all of them. The Grove’s Nubbins come out of hiding, blinking in the sun and shaking off the spray._  
**The Vision** _(soft)_: I have been to the end of every timeline. I did not expect the best one to have this many small, wet animals in it.  
**Jocasta** _(happy)_: I did.  
_The two of them step back through the last thread of the rift before it closes. Jocasta looks back once, and waves._  
_Your Nubbins fall asleep in a pile on the grass, right where the rift used to be. You let them._  

**Rewards**

- Keeper of Every World (title): Keeper title for finishing The Last Ultron and the Multiverse campaign.
- Multiverse ending recorded (feature): The ending you reached (the trap, the wish, or the Eternal) is recorded on the title screen, the same way Hazel’s Grove endings are.
- Memorial flower (decor): Eternal ending only. A flower at the foot of the falls that nobody planted. It never closes, and it cannot be moved.
- Multiverse campaign complete (flag): All six endgames are recorded in the journal; any you skipped stay open.

Sets on completion: `{"mv-e6":true,"mv-complete":true}`

**Notes:** Longest quest in the campaign. Step order and conditions (skip a step when its condition is false): s1, s2 always. ally-reg if mv-cw = registration; ally-res if mv-cw = resistance. doom-ally if mv-doom = ally; doom-rival if mv-doom = rival. mk-power if E3 done and mv-mk = power; mk-free if E3 done and mv-mk = free (see the mv-mk clash in the file header). goku if E4 done. toys if E5 done. trap, core always. end-trap / end-wish / end-eternal by mv-e6-ending (exactly one plays). after-reg / after-res by mv-cw; after-doom-ally / after-doom-rival by mv-doom; after-armageddon if E3 done; after-goku if E4 done; after-toys if E5 done. CORE CHOICES: “trap” is always shown. “wish” only if mv-wish = saved (needs E4). “eternal” only if the player has ever raised an Eternal Nubbin in the Free Grove or Hazel’s Grove (a read-only check across save slots, e.g. has:nubbin:eternal). The Eternal is the Multiverse save’s own copy, a reflection of the player’s oldest Eternal, made when E6 opens. Only the Multiverse save loses it on this ending; no other save is ever written, and the real Eternal stays in its Grove untouched. Warn once before confirming. Ultron wants an Eternal because he thinks it never ends; the end-eternal scene turns that error into the point (Eternals last because they are remembered, as the bible says). Record mv-e6-ending on the title screen. The memorial flower decor is granted only on the eternal ending. At the core the Vision argues for the trap and Jocasta for mercy, so the choice is never between a right and a wrong child. If only the trap is on offer (no saved wish, no Eternal), swap Jocasta’s plea (mv-e6-corescene#12, 0-based) for: “I would give him one more chance, if we had one to give. We do not. Do it gently.” s2 choice sets mv-e6-keeper-world = bonnie | lookout | latveria (cosmetic): the world the Keeper defends in person; the bout opens there. LINE SWAPS: mv-e6-gokuscene#9 (0-based) is the saved-wish line; if mv-wish = spent, replace it with: “And those people you wished home? Half of them are down there fighting drones with frying pans. That was a good wish.” mv-e6-toyscene#7 is the plush = lost version; if mv-plush = bonnie, replace with: “Your plush Nubbin is at the front, already wearing a tiny mission badge. It came in on Buzz’s shoulder.” mv-e6-afterknights#3: if mv-mk = power, replace with: “Across the river, Marc sits on the Mission steps, hands still faintly silver. He does not look at the moon at all.” If mv-doom = ally, Doom’s time-platform disc is spent here: add after mv-e6-trapscene#4 (0-based, before any other insert): n('The iron disc ticks once in your pocket. The Vision looks at it.'), l('vision', 'Doom’s jump. That will get us in. Nothing will get us out.'). If mv-ul09-vision = trust, add after mv-e6-trapscene#1: l('vision', 'I trusted Hank to hold him once. He held as long as he could. Now it is my turn.'). If mv-ul09-vision = follow, add instead: l('vision', 'I followed him into the dark once, to keep an eye on my family. I am still doing it.'). Tony speaks in mv-e6-trapscene on both Civil War paths (he arrives in either ally scene). Steve’s Rebirth Nubbin (CA1, mv-ca-rebirth-nubbin) may not be in the party; if absent, drop mv-e6-aftersteve#7 (0-based). Young Hank’s recording was made the night he planted the trap (UL8), before he wiped his own memory. Staging: Ultron’s core is an abstract space of silver lines; Ultron at the core is a figure of pale light, not armour. The Eternal ending fades to white, no damage shown. The final closing scene works for all three endings. Check Age of Ultron #1–10 and Avengers: Ultron Forever #1 beats before ship.
