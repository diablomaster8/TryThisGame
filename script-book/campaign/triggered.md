# Hazel's Grove: The campaign: triggered scenes

Scenes the rules queue by id rather than by chapter.

#### <a id="t-first-shadow"></a>Scene `t-first-shadow`

_Your Nubbin has gone grey. The ball above its head is dark._  
_When you reach for it, it flinches away from your hand._  
_Your hand stops in the air. You don’t know what to do with it, so you put it down, slowly, on the grass between you._  
**Fern** _(sad)_: I’m not going to pretend that isn’t on you. Hazel wouldn’t, and she’d never let me hear the end of it.  
**Fern**: Too many throws, or too many hungry nights. Or both.  
**Fern** _(soft)_: It doesn’t come back from grey. It can come back from scared. Slowly. If you’re patient every single day and never once aren’t.  
**Fern** _(soft)_: I’ll sit with you a bit, if you like. I’m no good at it. She was the one who was good at it.  

> Triggered when any Nubbin other than Sable turns Shadow, any chapter. Spoken by Fern (met in ch1) rather than Luna, so it works before ch3.

#### <a id="t-ran-away"></a>Scene `t-ran-away`

_The long grass at the edge of the Grove is pressed flat where something small pushed through it, and the gate is swinging._  
_It never swings for you. It swung for that._  
**Fern** _(sad)_: It’s gone. They do that, when they’ve decided nothing here is worth staying for.  
**Fern**: They sometimes come back. To the edge. To see if anything’s changed.  
**Fern** _(soft)_: I still look at the edge, some mornings. Old habit. Don’t ask.  

> Triggered on ranAway, any chapter. Fern; her last line is a quiet S3/S8 seed (she lost Bramble).

#### <a id="t-stray-returned"></a>Scene `t-stray-returned`

_Something grey is sitting at the very edge of the Grove, in the long grass, not coming in._  
_Watching the gate. Watching you._  
_You want to run to it. Every part of you wants to run to it._  
_Rule three, in her leaning hand: when you don’t know what to do, sit down next to them and wait._  
_So you don’t run. You set a plum in the grass. Then a second plum, in case the first was the wrong size._  
_Then you sit down a little way off._  
_It looks at the fruit._  
_Then at you. It doesn’t leave._  

> Triggered on strayReturned, any chapter. No NPC: the letter’s rule three, so it works in any chapter.

#### <a id="t-sable-bonded"></a>Scene `t-sable-bonded`

_Sable climbs into your lap. All the way in._  
_She is grey and she is heavy and she is warm, and the ball above her head is a small dark heart._  
_She turns round twice, the way they do, and lies down, and lets out a breath she seems to have been holding since winter._  
**Luna** _(soft)_: There. That’s the thing nobody in a hurry ever gets to see. Grey and loved. Both at once.  
_You don’t move for a long time._  
_You are sitting down next to her, and waiting. You have been for weeks._  

> Triggered when Sable bonds. Luna’s line no longer names the Circuit, so it works if bonding comes before ch5/ch7.

#### <a id="t-moss-first-pet"></a>Scene `t-moss-first-pet`

_You put your hand on his head. He is dry and soft, like moss on a warm wall, and lighter than he looks._  
**Moss**: Careful. I am very old and I bruise like fruit.  
_You start to take your hand away._  
**Moss** _(soft)_: …No, don’t stop.  
**Moss** _(soft)_: She did that every evening for forty years. You don’t notice a thing like that until it stops.  

> First pet of Moss in chapter 4 or later (he speaks). SIM: in noteCampaign, queue this only when c.chapter >= 4; otherwise queue t-moss-first-pet-early. Both may each play once, so a player who petted Moss early still hears him speak the first time after c4-open.

#### <a id="t-moss-first-pet-early"></a>Scene `t-moss-first-pet-early`

_The old grey one on the hill doesn’t move away when you come close. He doesn’t move at all._  
_You put your hand on his head. He is dry and soft, like moss on a warm wall._  
_For a moment, nothing. Then, very slightly, he leans into your palm, the way a plant leans towards a window._  
_A small tuft of grass is growing on top of his head. You decide not to mention it._  
_When you look back from the bottom of the hill, he is watching you go._  

> NEW. First pet of Moss in chapters 1–3, before he has spoken (c4-open is his first word). Narrator only; he leans into your hand and watches you go.

#### <a id="t-talk-generic"></a>Scene `t-talk-generic`

_A nod, a few words about the weather, and a short argument about whose Nubbin ate whose hat. It helps._  

> Fallback when talking to a Keeper with nothing chapter-specific to say. One line, chapter-neutral, rotated (seeded, never twice running) with T_TALK_GENERIC_ROTATION.

#### <a id="t-micro-clover-1"></a>Scene `t-micro-clover-1`

_Clover is kneeling by your Nubbin with a length of red string._  
**Clover**: Hold still, dear. I’m measuring you for a scarf.  
_Your Nubbin holds very still. It is looking at the string._  
**Clover** _(think)_: Round the neck… and a bit extra for growing.  
_The string goes into your Nubbin at one end. It does not come out._  
**Clover** _(shock)_: Oh. Well.  
**Clover**: The scarf will now be approximately this big.  
_She holds her hands apart, then a little wider, to be kind._  

> R0367 (FUN-78) ambient micro-scene for clover, chapters 3–4. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-luna-1"></a>Scene `t-micro-luna-1`

_Luna is standing in the long grass at midday, eyes shut, holding a watering can._  
**Luna**: I’m not asleep. I’m listening to the moonflowers.  
_It is noon. Moonflowers are not out at noon._  
**Luna** _(happy)_: They’re asleep. I’m listening to them be asleep.  
_The watering can has been pouring onto her boot the whole time._  
**Luna**: That’s on purpose. Boots get thirsty.  
_Your Nubbin climbs into the can. Luna waters it too, gently, without opening her eyes._  

> R0367 (FUN-78) ambient micro-scene for luna, chapters 3–4. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-pixel-1"></a>Scene `t-micro-pixel-1`

_Pixel has screwed a small brass clock to the fence post by the pond._  
**Pixel**: It tells your Nubbin when it’s lunchtime.  
_The clock ticks. Your Nubbin watches it with deep suspicion._  
_At noon a tiny door opens, and a wooden plum on a spring pops out._  
_Your Nubbin eats the wooden plum._  
**Pixel** _(think)_: Hm.  
**Pixel**: Version two: a less edible plum.  
_She writes on her wrist in pencil. It says: plum._  

> R0367 (FUN-78) ambient micro-scene for pixel, chapters 4–4. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-dusty-1"></a>Scene `t-micro-dusty-1`

_Dusty is on their knees in your crop plot with a trowel and a soft brush._  
**Dusty**: Don’t worry. I’m not digging up your beans. I’m digging under them.  
_After an hour they lift something out and hold it up to the light._  
**Dusty** _(happy)_: Look at that. Look at the age on that.  
_It is a spoon._  
**Dusty** _(think)_: Old spoon.  
_Your Nubbin takes the spoon, licks it, and buries it again._  
**Dusty**: Good instinct. That’s how the old ones kept things.  

> R0367 (FUN-78) ambient micro-scene for dusty, chapters 5–5. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-ember-1"></a>Scene `t-micro-ember-1`

_Ember is by the dojo door, showing your Nubbin a fighting stance._  
**Ember**: Feet apart. Weight low. Eyes on me.  
_Your Nubbin puts its feet apart, its weight low, and its eyes on a butterfly._  
**Ember** _(angry)_: On me.  
_The butterfly lands on Ember’s nose. Your Nubbin holds the stance perfectly._  
**Ember** _(think)_: …Fine. That’s focus. I’ll allow it.  
_She doesn’t brush the butterfly off for quite a long time._  

> R0367 (FUN-78) ambient micro-scene for ember, chapters 5–6. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-clover-2"></a>Scene `t-micro-clover-2`

_Clover has knitted a tea cosy with a bobble on top, the colour of a ripe plum._  
**Clover**: For your teapot, dear. You do have a teapot?  
_Before you can find the teapot, your Nubbin has climbed into the cosy._  
_Only its feet and the bobble show. It walks into the fence, very warmly._  
**Clover** _(happy)_: Oh, it suits it.  
**Clover**: I’ll do the teapot another one. Teapots are patient.  
_By evening your Nubbin will not be parted from it. The teapot stays cold._  

> R0367 (FUN-78) ambient micro-scene for clover, chapters 5–8. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-luna-2"></a>Scene `t-micro-luna-2`

_Luna is lying flat on your lawn in the middle of the afternoon._  
**Luna**: Practising. The stars come out at nine. I like to be in position.  
_Your Nubbin lies down beside her, exactly the same way, arms out._  
_Within a minute it is snoring. Within two, so is Luna._  
_A hen walks over both of them. Neither stirs._  
_At nine the stars come out. Luna wakes at dawn and smiles at the sky._  
**Luna** _(happy)_: Best stars all year.  

> R0367 (FUN-78) ambient micro-scene for luna, chapters 5–8. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-pixel-2"></a>Scene `t-micro-pixel-2`

_Pixel is timing your Nubbin’s nap with three stopwatches._  
**Pixel**: Byte uses one stopwatch. That’s why Byte is wrong.  
_Your Nubbin rolls over. All three stopwatches click._  
**Pixel** _(think)_: Forty-one minutes. Forty-one minutes. Forty-three minutes.  
_She looks at the third stopwatch for a long time._  
**Pixel**: That one’s Byte’s.  
_She puts it in a separate pocket, to talk to later._  

> R0367 (FUN-78) ambient micro-scene for pixel, chapters 5–8. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-ember-2"></a>Scene `t-micro-ember-2`

_Ember is sitting on the wall with her arms folded, being unfriendly at the view._  
_Your Nubbin climbs up beside her and leans on her arm._  
**Ember** _(angry)_: No.  
_Your Nubbin falls asleep on her arm._  
_She says no again, very quietly, so as not to wake it._  
_An hour later she is still there, glaring at anyone who comes near._  
**Ember** _(angry)_: It’s resting. Don’t make a thing of it.  

> R0367 (FUN-78) ambient micro-scene for ember, chapters 7–8. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-dusty-2"></a>Scene `t-micro-dusty-2`

_Dusty sets a small paper label beside your Nubbin, the kind they use for bones in the cliff._  
**Dusty**: Specimen. Round. Recent. Damp at one end.  
_Your Nubbin reads the label upside down, then eats it._  
**Dusty** _(think)_: Specimen consumes own records.  
_They write a second label and hold it a little higher._  
_Your Nubbin jumps._  
**Dusty**: Noted. In my head, where it’s safe.  

> R0367 (FUN-78) ambient micro-scene for dusty, chapters 7–8. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-clover-3"></a>Scene `t-micro-clover-3`

_Clover arrives with a soft parcel tied up in red string. Your Nubbin eyes the string._  
**Clover** _(happy)_: The scarf. I said I’d do it, and I have.  
_It goes round your Nubbin four times, then round you twice._  
**Clover**: I measured from memory. My memory is generous.  
_Wrapped to the eyes, your Nubbin waddles off to show the hens._  
_The scarf goes on following it for some time after it has gone._  
**Clover** _(soft)_: It’ll grow into it. Things do, here.  

> R0367 (FUN-78) ambient micro-scene for clover, chapters 12–13. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-luna-3"></a>Scene `t-micro-luna-3`

_Luna is planting moonflower seeds along your fence, one every step, humming._  
_Your Nubbin follows one step behind, digging each seed up to have a look._  
**Luna** _(happy)_: You’re helping.  
_It puts every seed back. Upside down._  
**Luna**: Then they’ll come up a little later, and a little surprised.  
_A week on, the fence is lined with moonflowers, each leaning as if it had to turn round._  
**Luna** _(soft)_: Best ones I’ve grown. Don’t tell them.  

> R0367 (FUN-78) ambient micro-scene for luna, chapters 12–13. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-pixel-3"></a>Scene `t-micro-pixel-3`

_Pixel gives your Nubbin a lantern the size of a thimble, on a stick._  
**Pixel**: It lights at dusk. Exactly at dusk. I’ve timed it against the sun.  
_Your Nubbin carries it about all afternoon, held very high, like someone important._  
_At dusk the lantern lights. Your Nubbin is so surprised it sits down._  
**Pixel** _(happy)_: All my clocks, and that’s the best review I’ve ever had.  
_She writes it on her wrist. It says: sat down._  
**Pixel**: Byte’s getting one too. His will be late.  

> R0367 (FUN-78) ambient micro-scene for pixel, chapters 12–13. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-ember-3"></a>Scene `t-micro-ember-3`

_Ember is on the sparring mat, facing your Nubbin. They both bow._  
**Ember**: One round. Don’t go easy on me.  
_Your Nubbin runs at her, trips on its own foot, and rolls into her ankle._  
_Ember falls over with great care, like a tree that has thought about it._  
**Ember** _(shock)_: Oof. Beaten.  
_Your Nubbin stands on her chest with both arms up._  
**Ember** _(happy)_: Tell anyone and I’ll deny it.  
_She is smiling, though. You’ve seen it now, and that counts._  

> R0367 (FUN-78) ambient micro-scene for ember, chapters 12–13. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.

#### <a id="t-micro-dusty-3"></a>Scene `t-micro-dusty-3`

_Dusty is digging a small, neat hole by the gate._  
**Dusty**: A time capsule. For whoever digs here next. I want them to find something good.  
_Into the hole go a pressed flower, a blue ribbon, and one old spoon._  
_Your Nubbin climbs in after the spoon._  
**Dusty** _(soft)_: No. Not you. You stay up here and get found every day.  
_They lift it out and brush it down with the soft brush, very carefully._  
**Dusty** _(happy)_: Specimen. Round. Recent. Very much kept.  

> R0367 (FUN-78) ambient micro-scene for dusty, chapters 12–13. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.
