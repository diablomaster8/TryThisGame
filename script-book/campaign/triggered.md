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
