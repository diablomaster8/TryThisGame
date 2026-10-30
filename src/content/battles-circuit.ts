/**
 * The Grove Circuit's scenes (recs FIGHT-22) and Play-fight Day (recs FIGHT-83's main-game scenes).
 *
 * CIRCUIT. Ten Keepers, one ribbon each (sim/battle/circuit.ts). Each Keeper has a pre-bout scene,
 * `bc-<keeper>-pre`, played when the player challenges them for their ribbon, and a post-bout scene,
 * `bc-<keeper>-post`, played once when the ribbon is won. Audience 'main'. The four field rules are
 * named in their Keeper's pre scene: Marina's puddle field, Luna's night field, Byte's one shuffle of
 * your slots, Dusty's team that naps a lot. Every line is timeless: the Circuit is never needed for
 * the main ending and can be played in any chapter the sim allows, so nothing here names a chapter,
 * Hazel, Moss, Sable, Ash or the stone. Pronouns: Sparks and Pixel she/her, Dusty they/them, Byte he.
 * Fights are play-fights: nobody is hurt, a tuckered-out Nubbin naps under a leaf.
 *
 * PLAY-FIGHT DAY. Three short scenes, audience 'all', that frame the first gentle bout (recs
 * FIGHT-24): `bc-playday-open` (hearts, seven against five), `bc-playday-bout` (the turn strip and
 * the type loop) and `bc-playday-hug` (every bout ends with a hug and a share). Their Learning Grove
 * versions are edu-battle-sprout.ts and edu-battle-reader.ts. Suggested trigger: the first time the
 * player opens Gentle bouts or the Circuit, outside chapters 9–11.
 *
 * FLAGS. None: the sim owns the ribbons (`world.circuit`). CHECKS name the win each post scene
 * follows, for the sim to match.
 */
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };
/** A punchline (STYLE.md, joke density). */
const gag = (l: Line): Line => ({ ...l, gag: true });

const N = say('narrator');
const FERN = say('fern');
const CLOVER = say('clover');
const MARINA = say('marina');
const SPARKS = say('sparks');
const PIXEL = say('pixel');
const LUNA = say('luna');
const DUSTY = say('dusty');
const EMBER = say('ember');
const BYTE = say('byte');
const NOVA = say('nova');

const S = (id: string, lines: Line[]): Scene => ({ id, lines });

export const BATTLES_CIRCUIT_VARIANTS: Scene[] = [
  // ------------------------------------------------------------ tier 1: Fern (Normal)
  S('bc-fern-pre', [
    N('Fern has chalked a ring on the grass behind her orchard. It is nearly round.'),
    FERN('Right. Ribbon bout. I’ve been practising my serious face.', 'happy'),
    FERN('This is it.', 'think'),
    gag(N('It is her ordinary face, but squintier.')),
    FERN('Mine are Normal types, before you ask. Good at hugs. Rubbish at plans.'),
    gag(FERN('If yours win, they get a ribbon. If mine win, they get a biscuit. They get a biscuit anyway.')),
    N('Her Nubbins toddle into the ring and wave at yours. Yours wave back. Nobody has explained the competitive bit.'),
  ]),
  S('bc-fern-post', [
    N('Fern’s last Nubbin sits down, yawns, and naps under a leaf, still smiling.'),
    FERN('Beaten by my neighbour. On my own grass. In front of my own plums.', 'sad'),
    gag(FERN('Here. I sewed the ribbon myself, so one end’s longer. That’s how you know it’s real.', 'happy')),
    N('Both teams share the biscuits. Fern takes the broken one and says she prefers it.'),
  ]),
  // ------------------------------------------------------------ tier 1: Clover (Normal)
  S('bc-clover-pre', [
    N('Clover’s ring is a circle of soft moss, with cushions round the edge for anyone who needs a sit-down.'),
    CLOVER('Gentle hands, gentle bouts. If anyone gets upset, we stop and have a cuddle. That’s the only rule.', 'soft'),
    gag(CLOVER('That and no biting. Two rules.', 'think')),
    N('Her Nubbins are the shy, slow ones nobody else picked. One is already hiding behind her boot.'),
    CLOVER('They’re braver than they look. That’s rather the point of them.'),
  ]),
  S('bc-clover-post', [
    N('The last of Clover’s team curls up on a cushion and naps, one hand still waving.'),
    CLOVER('You didn’t rush them. I watched. That’s worth more than a ribbon, but have the ribbon too.', 'happy'),
    gag(N('It is pale green and smells faintly of lavender. You have to fight the urge to nap on it.')),
  ]),
  // ------------------------------------------------------------ tier 1: Marina (Swim, puddle field)
  S('bc-marina-pre', [
    N('Marina has flooded the flat rocks below the tide pools. Every step goes splish.'),
    MARINA('Puddle field. Swim moves land harder here. Mine know that. Yours are about to.', 'think'),
    MARINA('Rule one: nobody’s brave. Rule two: if you slip, you sit. Sitting is allowed.'),
    N('Her Nubbins slide into the shallows as if they’ve been poured in.'),
    gag(N('One of yours steps in a puddle, looks at its foot, and is deeply offended.')),
    MARINA('Careful beats brave. On the ledge and in the ring.'),
  ]),
  S('bc-marina-post', [
    N('Marina’s last Nubbin floats on its back in the biggest puddle, fast asleep.'),
    MARINA('You kept your feet. Most people don’t, the first time.', 'happy'),
    gag(MARINA('Ribbon’s blue. Don’t drop it in a pool. I am not fishing it out again.')),
    N('She wrings out her sleeve and almost smiles. With Marina, almost counts.'),
  ]),
  // ------------------------------------------------------------ tier 1: Sparks (Run)
  S('bc-sparks-pre', [
    gag(SPARKS('RIBBON BOUT! Are you ready? I’m ready! I’ve been ready since breakfast!', 'happy')),
    N('Her runners are already bouncing. One is bouncing in a circle and barely touching the ground.'),
    SPARKS('Run types. Mine go first, mostly. That doesn’t mean they win. It means they’re early.'),
    SPARKS('If yours get puffed, shout. I’ve got buns in my bag. I’ve always got buns in my bag.'),
    gag(N('You have known Sparks long enough to know this is true. Nobody knows where the buns come from.')),
  ]),
  S('bc-sparks-post', [
    N('Her fastest runner finally stops, flops over, and naps with its legs still going a little.'),
    gag(SPARKS('You beat me! That was BRILLIANT! I hate it! I love it! I love it more!', 'happy')),
    SPARKS('Yellow ribbon. Hand-stitched. Don’t ask whose hand. It was Byte’s. Don’t tell him I told you.'),
    N('She hugs your Nubbins, then hers, then you, then a fence post by accident.'),
  ]),
  // ------------------------------------------------------------ tier 2: Pixel (Fly)
  S('bc-pixel-pre', [
    N('Pixel’s ring is laid out on a grid of string, with a little clock on a pole at every corner.'),
    PIXEL('Fly types. Up is a direction most people forget about. My team doesn’t.', 'think'),
    gag(PIXEL('The clocks time the turns. They all disagree by a second or so. Byte finds that unbearable.')),
    PIXEL('Ruling: anyone tuckered out naps on the blanket. Ruling: the blanket is also on a timer.'),
    N('Her Nubbins hover a hand’s width off the grass and look down at yours with polite interest.'),
  ]),
  S('bc-pixel-post', [
    gag(N('Pixel’s flyers drift down one by one and nap in a row, like washing on a line.')),
    PIXEL('Ruling: you won. Ruling: I’m annoyed. Ruling: I’m pleased. All three stand.', 'happy'),
    PIXEL('Mint green ribbon. I tested six greens. This one doesn’t fade.'),
  ]),
  // ------------------------------------------------------------ tier 2: Luna (Fly, night field)
  S('bc-luna-pre', [
    N('Luna won’t hold a bout before dark. You meet her in the night garden as the white flowers open.'),
    LUNA('Night field. Moon moves land a little harder after sunset. Mine are used to that.', 'soft'),
    gag(LUNA('Yours might be sleepy. That’s all right. So are the moths, and they still get about.')),
    N('Her Nubbins flicker between the flowers, pale as the petals and very hard to count.'),
    LUNA('Go gently near the beds. Some of these only open one night a year.'),
  ]),
  S('bc-luna-post', [
    N('Luna’s last flyer settles in a flower bed and falls asleep with its face in a petal.'),
    LUNA('You were patient with them in the dark. Most people flap.', 'happy'),
    gag(LUNA('A silver ribbon. It looks best by moonlight. Most things do. So do I, I’m told.')),
  ]),
  // ------------------------------------------------------------ tier 2: Dusty (Swim, naps)
  S('bc-dusty-pre', [
    gag(N('Dusty’s ring is a dug-out hollow at the foot of their cliff. It is mostly a very comfortable hole.')),
    DUSTY('Fair warning. My lot nap. A lot. Mid-bout, mid-move, mid-yawn.', 'think'),
    DUSTY('It isn’t a trick. It’s who they are. You wait till they wake up, and then they’re fierce.'),
    gag(N('One of Dusty’s team is already asleep in the ring. Dusty tucks a leaf round it and calls it warming up.')),
    DUSTY('Swim types. They like mud. Mud is only water that’s made plans.'),
  ]),
  S('bc-dusty-post', [
    N('All of Dusty’s team is asleep now, in a heap, one of them snoring in a small, damp way.'),
    gag(DUSTY('That’s a win. Probably. Hard to tell with mine. They look the same either way.', 'happy')),
    DUSTY('Brown ribbon. I found it in a drawer, not in the ground. Mostly.'),
  ]),
  // ------------------------------------------------------------ tier 3: Ember (Power)
  S('bc-ember-pre', [
    N('Ember’s ring is a square of raked sand behind her house. She raked it this morning, crossly.'),
    EMBER('Tier three. You got this far. Don’t expect me to be impressed.', 'angry'),
    gag(EMBER('…I’m a bit impressed. Don’t tell anyone.', 'think')),
    gag(N('Her Power types stand like small boulders that have decided to have opinions.')),
    EMBER('Mine hit hard. Tired ones rest. Nobody gets hurt in my ring. Not ever.'),
  ]),
  S('bc-ember-post', [
    N('Ember’s last Nubbin sits down heavily and naps with its arms folded, exactly like Ember.'),
    EMBER('Fine. Good. That was good.', 'soft'),
    EMBER('Red ribbon. Don’t make a thing of it.'),
    gag(N('She makes a small thing of it herself, and straightens it on your collar twice.')),
  ]),
  // ------------------------------------------------------------ tier 3: Byte (Power, shuffle)
  S('bc-byte-pre', [
    N('Byte has a clipboard, two stopwatches and a small chalkboard headed VARIABLES.'),
    gag(BYTE('Power types. Predictable. Reliable. Like a properly tied shoelace.', 'think')),
    BYTE('One condition. At the start I shuffle your line-up. Once. To see whether you plan, or just hope.'),
    gag(BYTE('Most people hope. Hope has a terrible track record. I’ve measured it.')),
    N('He shuffles your slots with great care, writes down the new order, then underlines it.'),
  ]),
  S('bc-byte-post', [
    N('Byte’s last Nubbin lies down, yawns, and naps across one of his stopwatches.'),
    BYTE('You adapted. Statistically, that’s the interesting result.', 'happy'),
    gag(BYTE('Grey ribbon. Pixel calls it charcoal. I’ve measured it. It’s grey.')),
  ]),
  // ------------------------------------------------------------ tier 3: Nova (Normal)
  S('bc-nova-pre', [
    N('Nova meets you at the valley’s edge with her pack on, as if she might set off straight after.'),
    NOVA('The last tier. Before we start, I’ve prepared a few words. About journeys.', 'happy'),
    gag(NOVA('And owls. Only briefly.')),
    N('She never gets to the owls. Her Nubbins are already in the ring, and so are yours.'),
    NOVA('Normal types. They’ve walked six valleys with me. They aren’t afraid of much.', 'think'),
  ]),
  S('bc-nova-post', [
    N('Nova’s last Nubbin naps on her pack, which it seems to think is a bed. It is right.'),
    NOVA('That’s the last ribbon on my road. Well walked.', 'soft'),
    gag(NOVA('I still have the speech. I’ll post it to you. With the owls.')),
  ]),
];

/** Play-fight Day (audience 'all'): the Learning Grove plays edu-battle-sprout/-reader in its place. */
export const BATTLES_PLAYDAY_VARIANTS: Scene[] = [
  S('bc-playday-open', [
    N('Fern has painted a sign on the green: PLAY-FIGHT DAY. BRING A NUBBIN. BRING A SNACK.'),
    FERN('Nobody gets hurt. Nobody gets cross. A tired Nubbin has a nap. That’s the whole rulebook.', 'happy'),
    gag(CLOVER('I wrote it. It’s one page. Byte wanted a second page. We said no.')),
    N('Everybody borrows a practice Nubbin today. Yours is a Swim type. Clover’s is a Fly type.'),
    N('A row of little hearts floats over each one. When the hearts run out, it’s nap time.'),
    N('Yours has seven hearts. Clover’s has five.'),
    CLOVER('Seven is more than five. Don’t let it go to your head.', 'think'),
    gag(FERN('Hers is small but clever. Like Clover.')),
  ]),
  S('bc-playday-bout', [
    N('Along the top, a strip of little faces shows whose turn comes next.'),
    CLOVER('Turns go round. Yours, mine, yours, mine. Nobody pushes in.', 'soft'),
    gag(N('Clover’s Fly type hovers over yours, looking smug.')),
    FERN('Swim soaks Fly! Wet wings are slow wings. Go on.'),
    N('Splash. Clover’s flyer lands with a small damp bump and looks at its feet.'),
    CLOVER('Fly goes over Run. Run is too quick for Power. Power makes a bigger wave than Swim.'),
    CLOVER('Round it goes, like a wheel. Everyone beats something. Everyone is beaten by something.'),
    gag(FERN('Like plums and wasps.', 'think')),
    N('Clover’s flyer sits down, yawns, and naps under a leaf.'),
  ]),
  S('bc-playday-hug', [
    N('The bout is over. Both Nubbins toddle to the middle and hug, the way Clover said they would.'),
    CLOVER('That’s how every bout ends here. A hug. Then a snack.', 'happy'),
    gag(FERN('Then a nap. Then, if I’m honest, another snack.')),
    N('Your Nubbin breaks its plum in half and gives the bigger half away. Nobody told it to.'),
    CLOVER('Winning is nice. Sharing is nicer. Ask anybody who’s been given half a plum.', 'soft'),
  ]),
];

export const BATTLES_CIRCUIT_FLAGS: string[] = [];

export const BATTLES_CIRCUIT_CHECKS: string[] = [
  'battle:win:circuit:fern',
  'battle:win:circuit:clover',
  'battle:win:circuit:marina',
  'battle:win:circuit:sparks',
  'battle:win:circuit:pixel',
  'battle:win:circuit:luna',
  'battle:win:circuit:dusty',
  'battle:win:circuit:ember',
  'battle:win:circuit:byte',
  'battle:win:circuit:nova',
  'battle:play:playday',
];
