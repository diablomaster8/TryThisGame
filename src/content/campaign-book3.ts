/**
 * Hazel's Grove, Book Three: The Long Night (chapters 9–12, and the eight endings).
 * The stone comes home, the valley keeps the lanterns lit through the longest night, the stone goes
 * back to the water it came from, and Hazel comes down the hill, and then goes up it.
 * Canon: briefs/story-bible.md. Branching is done with small variant scenes; see BOOK3_NOTES.
 */
import type { Chapter, Scene, Line, LineGesture, Mood } from '../config/story';

const S = (id: string, lines: Line[], extra: Partial<Scene> = {}): Scene => ({ id, lines, ...extra });

const say =
  (who: string) =>
  (text: string, mood?: Mood, gesture?: LineGesture): Line => ({
    who,
    text,
    ...(mood ? { mood } : {}),
    ...(gesture ? { gesture } : {}),
  });

const N = say('narrator');
const YOU = say('you');
const MOSS = say('moss');
const SABLE = say('sable');
const CORVIN = say('corvin');
const HAZEL = say('hazel');
const FERN = say('fern');
const MARINA = say('marina');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const PIXEL = say('pixel');
const LUNA = say('luna');
const EMBER = say('ember');
const BYTE = say('byte');
const DUSTY = say('dusty');
const NOVA = say('nova');
const WISP = say('wisp');
const CHORUS = say('chorus');

/** Extra speakers the campaign uses beyond the SPEAKERS in config/story.ts (chorus is also used in Book One). */
export const BOOK3_SPEAKERS: Record<string, { name: string; kind: 'keeper' | 'nubbin' | 'other' }> = {
  wisp: { name: 'Wisp', kind: 'nubbin' },
  /** Everyone singing at once (the Lantern Song, in c4-close and c10-vigil). A music cue, not a voiced line. */
  chorus: { name: 'Everyone', kind: 'other' },
};

export const BOOK3_CHAPTERS: Chapter[] = [
  {
    n: 9,
    title: 'Corvin’s Garden',
    opening: 'c9-open',
    goal: 'corvinChoice',
    goalText: 'Go up the valley to Corvin’s garden, and decide what to do.',
    hint: 'The choice is made in the scene. Whatever you choose, something comes home with you.',
    closing: 'c9-close',
  },
  {
    n: 10,
    title: 'The Long Night',
    opening: 'c10-open',
    goal: 'lanternsAgain',
    goalText: 'Light all four lanterns at dusk, and keep them burning through the longest night.',
    hint: 'Tap each lantern post to light it, and relight any the cold puts out. How often you petted Moss before tonight matters now.',
    closing: 'c10-close',
  },
  {
    n: 11,
    title: 'Hazel',
    opening: 'c11-open',
    goal: 'threeFriends',
    goalText: 'Talk with three different Keepers. Then sit with Hazel.',
    hint: 'Walk up to the Keepers and tap them. They stayed all night; they’ll stay a little longer.',
    closing: 'c11-close',
  },
  {
    n: 12,
    title: 'Keepers',
    opening: 'c12-open',
    goal: 'finalChoice',
    goalText: 'Decide what the Grove will be.',
    hint: 'The choice is made in the scene. The ending is chosen by everything you did. See the Paths page.',
    closing: 'c12-close',
  },
];

// Shared halves, so the variants differ only where they must.

const SHARD_OUT: Line[] = [
  N('It is a flat tin, the kind throat sweets come in. The paint is worn to bare metal where a thumb has rubbed it.'),
  N('It is furred with frost. The air round it is so cold it hurts your teeth.'),
];

const STONE_UNMADE: Line[] = [
  N('And the light comes up.'),
  N('Not cold. Warm. Gold, like the inside of a lantern, like a kitchen window seen from a dark road.'),
  N('It fills the cave and the ledge and the frozen falls, and the ice on the falls goes the colour of honey.'),
  N('Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet.'),
  N('…'),
];

const MOSS_GOES_IN: Line[] = [
  MOSS('I laid her shard under the long grass. I can take it the rest of the way. That seems fair.', 'think'),
  MOSS('Hold the lantern up, would you. I’d like to see where I’m going.', 'soft', 'chest'),
  N('You hold it up. Your arm is shaking. You hold it up anyway.'),
  MOSS('I sat down next to Hazel for a whole winter before I said a word to her. She fidgeted. She was very bad at it.', 'soft'),
  MOSS('You aren’t to fidget.', 'happy'),
  N('He walks down into the Wellspring, slowly, the way he walks into everything. The water comes up to his chin.'),
  N('Then over.'),
  ...STONE_UNMADE,
  N('When you can see again, the water is still, and lit very faintly from below, and Moss is gone.'),
];

const BANK_WAIT: Line[] = [
  N('You sit down on the warm rock at the edge of the water. When you don’t know what to do, sit down next to them and wait.'),
  N('So you wait. After a while Marina comes in from the cave mouth, coiling her rope, and sits on your other side.'),
  MARINA('Talk about him. Out loud. It helps.', 'soft'),
  MARINA('That’s all that singing was, back there. People talking about him out loud.'),
];

const BANK_DAWN: Line[] = [
  N('Outside, the falls start to run again: a trickle, then a rush, then the old roar.'),
  N('Steam rises off the spring again. Grey light comes in at the cave mouth.'),
];

const WALK_TOP: Line[] = [
  N('At the top she sits down on the turf, where you can see the whole Grove, and pats the ground beside her.'),
  N('From here you can see all of it. The pond. The four posts. The gate. Everybody, small and bright, doing things badly and together.'),
  HAZEL('There. That’s mine. That was mine.', 'soft'),
  HAZEL('It’s a good one. Don’t you dare let anyone tell you otherwise.', 'happy'),
  N('You sit with her a while. Neither of you says anything. It is the best part. It was always the best part.'),
];

/** The end of c11-moss-gone and c11-moss-passed. */
const MOSS_GONE_TAIL: Line[] = [
  HAZEL('He sat beside me a whole winter before he said a word. Forty years after that. Longer than that, beside everyone.', 'sad'),
  N('She is quiet a while. The thin grey Nubbin sleeps.'),
  HAZEL('He’ll be furious if we make a fuss. We’ll make a small one. Just us. Later.', 'soft'),
];

/** Hazel's Grove after its first body line, shared by end-hazels-grove (keep) and end-hazels-grove-open (Open). */
const HAZELS_GROVE_BODY: Line[] = [
  N('The frost never comes back to the long grass. The fourth lantern lights itself every dusk now, a little before the others, as if it’s keen.'),
  N('There is a flower on the hill that Moss will not let anyone step near. He sits beside it in the afternoons and talks to it.'),
  N('Sometimes he stops in the middle of a sentence, as if it has said something back. He says it usually has.'),
  N('Sable sleeps on your feet. Grey as ash. Heart above her head. Both at once, for ever.'),
  N('Pixel’s trust meter still hangs by the cottage door. Somebody has painted over MAYBE. It now says OBVIOUSLY.'),
  N('Some nights, half asleep, Sable makes a small sound that might be a word. You never wonder any more which one it means. It’s yours now.'),
];

// Chapter 9's garden, shared by c9-open and its Collector variant c9-open-sold.
const C9_ARRIVE: Line[] = [
  N('The road up the valley climbs into frost. It is nearly midwinter, but this frost was here in August too.'),
  N('Ember walks beside you with her hands in her pockets. She hasn’t said a word since the bridge.'),
  N('Corvin’s garden is clean, square and silent. Grey Nubbins stand in grey rows. Not one of them is touching another.'),
  N('The railings are furred white. The grass crunches. Your breath hangs in the air in front of you and does not drift.'),
];

const C9_GARDEN: Line[] = [
  CORVIN('You came. Good. And you brought Ember, who hates me. That’s fair. I’d have brought someone who hated me.'),
  CORVIN('Look at them. Not one has ever thrown a race, bitten a judge, or run off into the night. Yours can’t say that.', undefined, 'point'),
  EMBER('Ash is in the third row. She won’t look at me. You did that.', 'angry'),
  CORVIN('I made her a champion, Ember. You made her a pet. One of those lasts.'),
  N('Ember’s hands are shaking. Corvin’s are not. They are very white, and he keeps the left one pressed flat to his coat.'),
  N('Over the breast pocket. Always over the breast pocket.'),
  CORVIN('You’ve read her notebook. I can see it on you. She writes everything down.', 'think'),
  CORVIN(
    'She’ll have written that I stole from her. I did. She’ll have written that I was cruel. I never was. Not once.',
  ),
  CORVIN(
    'She came here, you know. In the autumn. Stood at my gate for an hour and didn’t knock. Then she went back to her strays.',
    'think',
  ),
  CORVIN(
    'They don’t go hungry here unless they choose to. They’re never thrown. They don’t get sick, or lost, or frightened.',
  ),
  N(
    'He looks along the rows the way some people look at a bookshelf they have dusted every day for years.',
  ),
  CORVIN(
    'Hers ran away. Hers got sick. Hers died in her arms, and she cried on the hill, and called it love.',
    'sad',
  ),
  CORVIN(
    'I wanted them safe. I still want it. I have never understood why that makes me the villain of her story.',
  ),
  N(
    'Somewhere in the rows, a grey Nubbin sneezes. It does not move. None of the others look round.',
  ),
  EMBER('Bless you.', 'think'),
  N('She says it without thinking. Nobody in this garden has heard those words in years.'),
  N('Every grey eye in the garden is on you, waiting for the next bad thing.'),
];

const C9_CHOICE: Partial<Scene> = {
  choices: [
    {
      id: 'confront',
      label: 'Tell him what Hazel wrote. Make him look at them.',
      set: { corvin: 'reconciled' },
      friendship: { ember: 3, luna: 2 },
      then: [
        N('You open the notebook and read it to him. Day 300-something. The brown one let me touch her ear. Took two months. Worth it.'),
        N('He listens with his eyes shut.'),
        CORVIN('…She said that to me once. “Took two months. Worth it.” I told her I didn’t have two months.', 'sad'),
        CORVIN('I was twenty-two. I had nothing but months.', 'sad', 'down'),
        N('He opens his eyes. He looks at the third row for a long time, the way you look at something you have walked past every day.'),
        N('Then he goes to the gate and opens it, and does not close it.'),
        CORVIN('Tell Ember Ash can go. Tell her I never made it quicker. I only made it quieter.'),
        EMBER('Tell me yourself.', 'angry'),
        N('…'),
        CORVIN('Ash can go, Ember.', 'soft'),
        N('Ash does not move for a long time. Then she walks out of the third row, past Ember, not looking at her.'),
        N('Ember follows her down the road, three steps behind, the way you follow something you must not frighten.'),
      ],
    },
    {
      id: 'bargain',
      label: 'Buy Ash back. Whatever it costs.',
      set: { corvin: 'bargained', boughtBack: true },
      friendship: { ember: 5 },
      then: [
        CORVIN('Two hundred. The same as always. A fair price for a champion who no longer wins.'),
        N('You count it out onto the gatepost. The Shells stick to the frost, and you have to prise each one off with your thumb.'),
        N('Ash walks out beside Ember without looking at either of you. She is grey, and she is going home, and both are true.'),
        EMBER('I don’t know how to thank you. I’ll work it out. Give me a few years.', 'soft', 'shrug'),
      ],
    },
    {
      id: 'force',
      label: 'Open every pen. Now.',
      set: { corvin: 'forced', freedByForce: true },
      friendship: { ember: 2, marina: -2, fern: -2 },
      then: [
        N('You throw the latches, one after another. The iron is so cold your fingers stick to it.'),
        N('The grey Nubbins do not move. They have never been told they could.'),
        N('Then Ash takes one step. Then all of them: a grey tide pouring out past Corvin, past you, into the trees, towards the Hollow and the dark.'),
        CORVIN('You think you freed them. You scattered them. Half will starve.', 'angry'),
        CORVIN('Hazel would have fed them one at a time for a year. You had an afternoon.', 'angry'),
        EMBER('She looked at me. On her way past. She looked at me.', 'soft'),
      ],
    },
  ],
};

/* c9-open-sold's own choice set: the same as C9_CHOICE (same ids, sets and friendship), except that bargain also buys
 * back your sold Nubbin on screen, since the bargain side effect brings it home. */
const C9_SOLD_BARGAIN_EXTRA: Line[] = [
  CORVIN('And that one. Yours, once. The two hundred covers it.', 'think'),
  N('Your old Nubbin walks out behind Ash, number and all. It doesn’t look at you, but it comes anyway.'),
];
const C9_CHOICE_SOLD: Partial<Scene> = {
  choices: (C9_CHOICE.choices ?? []).map((c) =>
    c.id === 'bargain' && c.then ? { ...c, then: [...c.then.slice(0, 2), ...C9_SOLD_BARGAIN_EXTRA, ...c.then.slice(2)] } : c,
  ),
};

export const BOOK3_SCENES: Scene[] = [
  // ================================================================ chapter 9: Corvin's Garden
  S('c9-partner', [
    N('The night before you go up the valley, a note comes under the door.'),
    N('The paper is very good. The handwriting is very neat. The envelope is cold, as if it has been kept in a pocket next to something colder.'),
    CORVIN('“Partner. Come up tomorrow. I’d like to show you what your two hundred Shells became.”'),
    CORVIN('“It’s doing well. Quiet. Nothing has hurt it since the day you let it go.”'),
    CORVIN('“You understood something that afternoon that Hazel never did. Come and see. C.V.”'),
    N('You read it twice. Then you put it in the drawer, under Hazel’s letter, and then you take it out again and put it somewhere else.'),
  ]),
  S('c9-open', [...C9_ARRIVE, ...C9_GARDEN], C9_CHOICE),
  S(
    'c9-open-sold',
    [
      ...C9_ARRIVE,
      N('In the second row stands one with a number painted on its side in neat white paint. It was yours. It does not look up.'),
      ...C9_GARDEN,
    ],
    C9_CHOICE_SOLD,
  ),
  S('c9-shard-reconciled', [
    N('The garden is empty. Corvin stands by the open gate with his hand flat on his coat.'),
    CORVIN('There’s something else. You’ll have guessed. She guessed, I expect, years ago. She always knew where things were.', 'think'),
    N('He takes it out of his breast pocket.'),
    ...SHARD_OUT,
    CORVIN('I dug it up from under her lantern the autumn I was twenty-two. I meant to put it back by spring.', 'sad'),
    CORVIN('I was going to show her it could be done kindly. It can’t. It only does one thing. It just does it so quietly you don’t notice for twenty years.'),
    N('He holds it out. His hand is blue to the wrist.'),
    CORVIN('Take it. Please. Before I think about it.'),
    N('You take it. It is heavier than a tin should be, and colder than anything, and very slightly humming.'),
    N('Corvin tucks his empty hand under his arm. He looks surprised, as if he had forgotten there were other places to keep a hand.'),
    CORVIN('I haven’t been warm in twenty-two years.', 'soft'),
    N('He doesn’t walk you to the road. When you look back he is still standing in his empty garden, both hands in his armpits, like a boy told to wait.'),
  ]),
  S('c9-shard-bargained', [
    N('Ember and Ash are halfway down the road. You turn to follow, and Corvin says your name.'),
    CORVIN('Wait. You’ve paid for the champion. Have the rest.', 'think'),
    N('He takes something from his breast pocket and tosses it to you underhand, the way you’d toss someone their keys.'),
    N('You catch it, and gasp.'),
    ...SHARD_OUT,
    CORVIN('Hazel’s. Or the valley’s. Or nobody’s. I’ve stopped knowing.'),
    CORVIN('Take it. It never worked on anything that mattered.'),
    N('He wipes his empty hand down his coat, hard, as if something has come off on it.'),
    CORVIN('That’s the end of our business. Mind the ice on the road.'),
  ]),
  S('c9-shard-forced', [
    N('The last grey tail vanishes into the trees. The pens hang open. The ground is churned to frozen mud.'),
    N('Corvin is on his knees. Somebody knocked him over in the rush. Possibly everybody.'),
    N('Something has fallen from his coat into the frost. And the frost is growing outwards from it, as you watch.'),
    ...SHARD_OUT,
    CORVIN('Leave that.', 'shock'),
    N('You pick it up. It is so cold it burns, and very slightly humming, and much heavier than a tin should be.'),
    CORVIN('Give it back. You don’t know what it is. You don’t know what it’s for.', 'angry'),
    N('He gets one foot under him and reaches for it. Then he stops with his hand out, and looks at the hand, as if he has never seen it empty.'),
    CORVIN('…No. Keep it. Keep it, and see how long you last.', 'sad', 'down'),
    N('Ember takes your arm and walks you to the road. She doesn’t let go until the frost stops crunching under your boots.'),
    EMBER('Whatever that is, don’t let it near Ash. Don’t let it near anyone.', 'angry', 'shrug'),
    N('On the road home, something grey is following Ember, three steps behind. Ember doesn’t look round. She doesn’t dare.'),
  ]),
  S('c9-shard-collector', [
    N('The last grey tail vanishes into the trees. The pens hang open. Corvin looks at them for a long time.'),
    N('Then, of all things, he laughs.'),
    CORVIN('Quick. Nobody asked them. Nobody asked me. That’s my method, partner. You’ve just used it on me.', 'think'),
    N('He takes it out of his breast pocket.'),
    ...SHARD_OUT,
    CORVIN('I’ve carried this for twenty-two years. It’s the reason my garden was quiet. Nothing in it was ever lost, or hurt, or frightened.'),
    CORVIN('Take it. You’ll want it now. You understand what it’s for. The others never will.', 'soft'),
    N('He presses it into your hands and folds your fingers over it. His fingers are colder than the tin.'),
    CORVIN('With this, they’ll never leave you.'),
    N('It is heavy and humming and so cold it burns. And then, which is worse, it doesn’t. It feels like nothing at all.'),
    N('When you look up he is smiling, the way he smiled at your gate the first day. He means it as a kindness. That is the worst part.'),
    N('On the road home, something grey is following Ember, three steps behind. Ember doesn’t look round. She doesn’t dare.'),
  ]),
  S('c9-sable', [
    N('Sable is waiting at the gate when you get back. She waited here once before, the morning you went to the Hollow.'),
    N('This time she gets up and comes to meet you.'),
    N('She puts her nose to your coat, to the pocket where the tin is, and breathes in.'),
    N('She doesn’t flinch. She sits down, and looks at the pocket, and then up at you, for a long time.'),
    LUNA('She knows that cold. She knows it better than any of us ever will.', 'soft'),
  ]),
  S('c9-close', [
    MARINA('Whatever you did up there, the valley’s already talking about it.', undefined, 'shrug'),
    MARINA(
      'Fern says it was brave. Byte says it was statistically unwise. Both of them are right. That’s the trouble with this valley.',
      'think',
      'shrug',
    ),
    N(
      'On your step is a pie from Fern, still warm, with a note on top: RULE ONE. THE SECOND HALF. THE BIT SHE NEVER DID.',
    ),
    MARINA(
      'She baked two, you know. Won’t say where the other one went. Went pink when I asked.',
      'think',
    ),
    N('Dusk. The tin is in your coat, and the coat is stiff with frost down that side.'),
    N('Moss is waiting at the foot of the hill. You didn’t see him come down. You can see the grass through him.'),
    MOSS('…Show me.'),
    N('You open the tin. Inside, on a bed of grey felt, is a shard of something like ice. Dark at the heart. No longer than your thumb.'),
    N('Moss looks at it for a long time.'),
    MOSS('Cinder.', 'soft'),
    MOSS('She made it to save them. She did save them. That is the trouble with it.', 'sad', 'down'),
    MOSS('I promised Hazel I wouldn’t tell you where it had gone. She wanted him to walk it down this lane himself.', 'think'),
    MOSS('He couldn’t. You did. I will let her decide how she feels about that.'),
    N('For the first time in twenty-two years, all four pieces of the Heartstone are in the Grove.'),
    N('Three are asleep under their lanterns. This one is awake. You can feel it, like a draught from a door left open.'),
    MOSS('Put it under the long grass for now, where I laid it. It won’t sleep. It has been awake too long, in a coat, next to a heart.'),
    N('You do. As you kneel, the glass of the dark fourth lantern above you frosts over, white, from the bottom up.'),
    MOSS('There is one place to unmake it. Where it was made. The Wellspring, behind the falls.'),
    MOSS('On the longest night of the year the falls freeze and the spring opens. What came out of it can go back in.', 'think'),
    MOSS('The other three sleep. Let them. Some things you keep by keeping watch.'),
    MOSS(
      'Only a grey one can carry it close. The cold has already done its worst to the grey. It has nothing new to say to them.',
    ),
    YOU('So. The longest night, the Wellspring, and someone grey carries it.'),
    MOSS('Yes. Three days. Eat something first.', undefined, 'nod'),
    MOSS('None of us was grey, then. We could only break it, and wait.', 'sad', 'down'),
    MOSS('…I am grey enough.', 'soft'),
    N('He doesn’t go back up the hill. He sits by the long-grass post all night, and you sit with him, and neither of you says anything.'),
    N('By morning the frost has crept from the long grass halfway to the pond. Moss is a little harder to see.'),
    N('Three days to the longest night.'),
  ]),

  // ================================================================ chapter 10: The Long Night
  S('c10-open', [
    N('The longest night. The sun gets up late and low, and doesn’t try very hard.'),
    N('The frost has reached the pond. There is a skin of ice on the water, thin as a page.'),
    N('Moss is on the hill, sitting exactly where he sat the first day. When you climb up, you can see the hill through him.'),
    MOSS('Eternals don’t age. We fade. We are made of being remembered, and the ones who remembered me best are mostly flowers now.', 'soft'),
    MOSS('The girl with the bucket. Briar. Hush.', 'soft'),
    N('He doesn’t say the next name. You hear him not say it.'),
    MOSS('Tonight all four lanterns must be lit, and kept lit, until the sun comes back. The cold will come at them. Let it.'),
    MOSS('It isn’t the light that matters. It’s the gathering. The light is only how people know where to stand.'),
    MOSS('And at the turn of the night, someone takes that tin to the water.', 'think'),
    YOU('You said you were grey enough.'),
    MOSS('I did say that.', 'soft'),
    N('Below you, the gate goes: a lift, a push, a squeal of hinges. Somebody has come early.'),
    N('Fern, with a lantern and a flask and a blanket she has very obviously borrowed from a horse.'),
    FERN('I didn’t know what to bring, so I brought everything that was near the door.'),
    N('Then Sparks, with a coil of wire over one shoulder and a lantern under each arm. Then Pixel, with the timing box wrapped in a scarf like a baby.'),
    SPARKS('Nobody touch the wiring. I’ve wired it for cold. I’ve never wired anything for cold. It’s going to be great.', 'happy'),
    PIXEL('It’s going to be fine. I’ve put in a backup. And a backup for the backup.', 'think'),
    N('Clover, with soup. Luna, who has been up since yesterday and says this is her normal. Dusty, with a spade, in case of what they won’t say.'),
    N('Nova, who walked in over the ridge with snow on her hat and says it’s nothing to the high passes.'),
    N('Marina, with rope. She doesn’t say what for. She looks up the valley towards the falls, and then at you.'),
    N('Ember, last, with a lantern. Ash walks a step behind her heel, grey, looking at nobody. But she came.'),
    N('And Byte, with a clipboard.'),
    BYTE('Statistically, an Eternal that has been petted regularly fades sixty per cent slower. I ran the numbers.', 'think', 'shrug'),
    BYTE('I would like it noted that I ran them while believing it was a hoax.'),
    MOSS('Noted.', 'soft'),
    N('Byte can’t hear him. Byte nods anyway.'),
    N('The sun touches the ridge. Moss looks down at all of them, all of you, coming in at the gate one at a time.'),
    MOSS('Light them.', 'soft'),
  ]),
  S('c10-sable-watch', [
    N('All afternoon, Sable sits by the long-grass post, two steps from where the tin is buried, with her back to it.'),
    N('As if she is guarding it from everyone. Or everyone from it.'),
    N('Clover’s grey blanket is over her back. Clover put it there an hour ago and walked away, and Sable has let it stay.'),
    LUNA('She hasn’t eaten. She won’t come away. I’ve stopped asking.', 'soft'),
  ]),
  S('c10-vigil', [
    N('Four lanterns, lit. Pond, stream, old wall, long grass. And round each post, people, holding lanterns of their own.'),
    N('The fourth burns low and blue. The tin is underneath it, and the frost round the post is a hand’s width thick.'),
    N('Night comes down, very clear, very still. Past the ridge you can hear the falls, the way you always can.'),
    N('The first cold comes an hour after dark.'),
    N('It comes out of the long grass like a breath let out. Frost runs up the posts. Every flame in the Grove lies down flat.'),
    SPARKS('Hold them! Hands round the glass! Not on the glass, ROUND it!', 'shock'),
    N('The stream lantern goes out. Pixel’s timing box clicks, and clicks, and gives a small sad beep.'),
    PIXEL('Backup’s frozen. Backup for the backup’s frozen.', 'shock'),
    SPARKS('Then we light it by hand, like the olden days. Fern, matches.'),
    FERN('Why would I have matches?'),
    N('Fern has matches. Fern has, it turns out, everything that was near the door.'),
    N('The stream lantern catches. The cold passes the way a wave passes, and the flames stand up again.'),
    N('Between the waves, people talk. That is most of what a vigil is.'),
    CLOVER('Soup. Everyone has soup. I don’t care if you aren’t hungry. You’re holding a lantern, you’re working.', 'happy', 'shrug'),
    DUSTY('Fossil hated the cold. She used to ride in my coat. I keep putting my hand in the pocket.', 'soft'),
    NOVA('In the high passes they say: stand closer than is polite. Nobody minds, on a night like this.'),
    N('So everyone stands closer than is polite. Nobody minds.'),
    LUNA('This is my hour. I’ve sat up a thousand nights. Never one with this many people in it.', 'soft'),
    BYTE('The waves are about forty minutes apart. I’m saying it out loud because saying it out loud helps.', 'think'),
    BYTE('It helps me. It may not help you.'),
    N('The second cold comes. It is worse. It comes from the long grass in a white rush you can see, and the fourth lantern shrinks to a blue bead.'),
    EMBER('No. No, you don’t.', 'angry'),
    N('Ember takes off her coat and wraps it round the post, round the glass, and puts both arms round all of it.'),
    N('Ash presses against the backs of her legs, and stays there.'),
    N('The blue bead holds. Just.'),
    EMBER('Nobody say anything.', 'angry'),
    N('Nobody says anything. Clover passes Ember a soup. Then, after a moment, she takes off her own scarf and puts it round Ember’s neck.'),
    N('It gets colder. The kind of cold that makes you forget your hands are yours.'),
    N('Somebody starts to sing. Luna, you think. Quietly, the way you sing to something sleeping.'),
    LUNA('Slow hands, warm hearts, the gate stuck fast —', 'soft'),
    CHORUS('what’s kept with love is kept to last.', 'soft'),
    N('Everyone has it by the second line. Even Byte, who says he doesn’t know the words, and does.'),
    CHORUS('Light one for the ones who went up the rise', 'soft'),
    CHORUS('with the morning sun in their sleeping eyes;', 'soft'),
    CHORUS('we are made of the ones who remember us here,', 'soft'),
    CHORUS('so we gather, we gather, we gather each year.', 'soft'),
    N('Up on the hill, Moss is listening. In the lantern light he is a little easier to see.'),
    N('Only a little. You are almost sure.'),
  ]),
  S('c10-vigil-wisp', [
    N('At the edge of the light, in the long grass, there is a thin grey shape with a torn ear.'),
    N('Wisp isn’t watching the lanterns. He is watching the fourth post, and what is buried under it, the way he once watched Sable’s fruit.'),
    WISP('…warm.', 'soft'),
    N('It is the coldest thing in the Grove. To him, you realise, it has always looked like the warmest.'),
    CLOVER('Leave him be. He came. That’s something.', 'soft'),
  ]),
  S(
    'c10-lull',
    [
      N('Some time after the song, in the deep middle of the night, the cold stops coming for a while.'),
      N('Nobody trusts it. Everybody sits down anyway, on whatever is nearest: a bucket, a step, Dusty.'),
      DUSTY('I don’t mind. I’m warm. I’ve been digging.', undefined, 'shrug'),
      N('Pixel is asleep across the timing box, cheek on the dial. It beeps, very softly, at every out-breath.'),
      FERN('I brought biscuits. They’ve frozen. You can still suck them.', 'happy'),
      N(
        'The biscuits taste of ginger and lantern smoke. Sparks has four. Nobody counts. Byte counts.',
      ),
      N('Pixel opens one eye as Byte steps over her.'),
      PIXEL('Your lace is undone.'),
      BYTE('I’m aware of the lace.', undefined, 'chest'),
      PIXEL('He’s been aware of it since our wedding. All the way down the aisle.', 'happy'),
      BYTE('It was a short aisle. Statistically, I nearly made it.', undefined, 'shrug'),
      N(
        'She is asleep again before he has finished. He tucks her scarf over the dial so the beeping won’t wake her.',
      ),
      N(
        'Then Byte sits down next to you on the cold grass. He stopped writing on his clipboard an hour ago. He holds it like a hot-water bottle.',
      ),
      BYTE('Can I ask you something unscientific?', 'think'),
      BYTE('If it works. If the cold stops, and the morning comes, and the fourth lantern lights. What will have done it?'),
      BYTE('The lanterns? Or us? I can’t design a test. There’s no control group for a night like this.'),
    ],
    {
      choices: [
        {
          id: 'lull-lanterns',
          label: 'The lanterns. Light is light.',
          friendship: { byte: 1 },
          then: [
            BYTE('Thank you. That’s measurable. I find that very comforting.', 'happy', 'nod'),
            BYTE('…I don’t believe you. But I find it very comforting.'),
          ],
        },
        {
          id: 'lull-us',
          label: 'Us. The lanterns just show people where to stand.',
          friendship: { byte: 2 },
          then: [
            BYTE('That sounds like something Moss would say. I can’t hear him. I’m starting to think that’s my fault.', 'think', 'chest'),
            N('He writes it down anyway: one line, slowly, on a clipboard that has frozen to his glove.'),
          ],
        },
        {
          id: 'lull-matter',
          label: 'Does it matter, if the morning comes?',
          friendship: { byte: 1 },
          then: [
            BYTE('Yes. Enormously. To me.', 'think', 'nod'),
            BYTE('…Not tonight, though. Tonight I’ll take the morning however it comes.', 'soft'),
          ],
        },
      ],
    },
  ),
  S('c10-falls', [
    N('And then, somewhere past the ridge, the falls stop.'),
    N('You have heard them every night since you came here, without ever once hearing them. Now there is nothing. The silence is enormous.'),
    MARINA('That’s it. That’s the turn.', 'think', 'nod'),
    MARINA('The falls are frozen. The spring’s open. We’ve got till dawn, and the ledge will be ice.'),
    N('Moss comes down the hill. It takes him a long time. Nobody hurries him.'),
    MOSS('The rest of them hold the lanterns. Until the sun’s up. Whatever they hear.', 'think', 'shrug'),
    YOU('Moss says hold them. Till the sun’s up. Whatever you hear.'),
    SPARKS('What would we hear?'),
    N('Moss doesn’t answer that. You don’t pass it on.'),
    N('You kneel at the long-grass post and dig. The tin is frozen into the earth. It comes free with a crack like a knuckle.'),
    N('You open it. The shard lies in its grey felt, and the cold off it makes your eyes stream.'),
  ]),
  S(
    'c10-bearer-sable',
    [
      N('Moss bends towards it. Before he can reach it, something grey steps between you.'),
      N('Sable. She looks at the shard. She looks at Moss. Then she looks at you, for a long moment, the way she looked at your hands the first night.'),
      LUNA('Oh, sweetheart. No.', 'sad', 'down'),
      MOSS('…Yes.', 'soft'),
      MOSS('Only the grey can carry it close. I am grey with age. She is grey with what was done to her. That kind goes all the way through.', 'think'),
      MOSS('It has already done its worst to her. It has nothing new to say. That is the sad thing. Tonight it is also the useful thing.'),
      N('Sable bends her head and picks up the shard in her mouth, as gently as an egg.'),
      N('The frost runs up her muzzle and stops. She shivers once, all over. She does not go still.'),
      N('Luna crouches and puts her forehead against Sable’s, just for a second. Then she goes back to her lantern without a word.'),
    ],
    { set: { stoneBearer: 'sable' } },
  ),
  S(
    'c10-bearer-moss',
    [
      MOSS('Mine. I laid it there. I can carry it the rest of the way.', 'soft'),
      N('He bends and takes it, the way you take something out of a fire: quickly, without flinching, because flinching is worse.'),
      N('The frost climbs his face and settles in the creases. He is so faint now that the shard seems to float by itself.'),
      MOSS('There. Not so bad. Briar would have made a joke about it. I can’t think of one.', 'soft'),
      N('Nobody else can hear him. They see an old grey shape with ice on his face and a blue light in his mouth.'),
      N('They stand a little straighter at their lanterns.'),
    ],
    { set: { stoneBearer: 'moss' } },
  ),
  S('c10-ledge', [
    N('Marina leads, with her rope and her lantern. You follow. Behind you comes the stone, carried low, glowing blue through grey fur.'),
    N('Behind all of you the four lanterns get smaller, and the singing gets quieter, and then it is only something you remember.'),
    N('The falls hang frozen over the cliff: a long white pour of glass, stopped mid-fall. The spray stands in the air like breath.'),
    MARINA('Hands on the rock. Feet where my feet go. Don’t be brave.', 'think'),
    MARINA('Brave people fall off.'),
    N('The ledge is a hand’s width of ice. Marina ties the rope round your waist, then her own. The one carrying the stone goes untied. There is no knot that small.'),
    MARINA('Hazel came along here every week, the summer I taught hers to swim. Like a goat. Complained the whole way.', 'soft'),
    N('Behind the ice, the cave opens out. The rock glitters. It is warm in here, properly warm, like a kitchen, and it smells of wet moss and spring.'),
    N('The Wellspring is open. The frost round its rim has cracked and drawn back, and the water underneath is moving, lit from below by nothing at all.'),
    N('You have never seen anything so old. Moss told you the first ones came up out of this, each a small light. Now you believe it.'),
    MARINA('I’ll stay at the mouth. Somebody has to hold the rope.', 'soft', 'chest'),
  ]),
  S(
    'c10-edge',
    [
      N('At the water’s edge, the stone stops humming.'),
      N('Then it speaks. Not in words. It doesn’t need words.'),
      N('It shows you the Grove, still. Every Nubbin you have ever loved, sitting quietly in the grass. Never hungry. Never thrown. Never sick.'),
      N('Nothing fades. Nothing runs into the dark. Nobody ever goes up the hill.'),
      N('Safe, it says. Safe, safe. Keep me, and nothing will ever hurt them again. And nothing will ever hurt you through them.'),
      N('It is the kindest voice you have ever heard. It sounds like someone who loved them very much.'),
      N('Moss says nothing. He said it all once, by the frozen post, in the dawn. He is trusting you to remember.'),
    ],
    {
      choices: [
        {
          id: 'unmake',
          label: 'Unmake it.',
          set: { keptStone: false },
          then: [
            YOU('Unmake it.'),
            N('You say it out loud, so that it can’t pretend it didn’t hear.'),
          ],
        },
        {
          id: 'keep',
          label: 'Keep it. They’d never be hurt again.',
          set: { keptStone: true },
          then: [
            N('You hold out your hand.'),
            N('For a moment nothing happens. Then the stone is given to you, gently, because it has been carried gently all the way here.'),
            N('It isn’t cold. That is the first thing you notice. It isn’t cold at all.'),
            MOSS('…Ah.', 'sad', 'down'),
            N('That is all he says. He turns and walks back towards the cave mouth, and does not wait for you.'),
          ],
        },
      ],
    },
  ),
  S('c10-kept', [
    N('You walk back along the ledge with the stone in your breast pocket. Your feet don’t slip once.'),
    N('Behind you the falls begin to run again. A rim of frost stays round the spring. You don’t look back.'),
    N('Dawn comes up grey. In the Grove three lanterns are still burning. The fourth, by the long grass, has gone out.'),
    N('The Keepers are still at their posts, swaying on their feet, faces raw with cold. They look at you, and wait for you to tell them.'),
    FERN('Well? Is it… is it done?', 'think'),
    N('You find you don’t want to say. You put your hand on your coat instead, over the pocket.'),
    EMBER('…I know that. I know where I’ve seen that.', 'angry'),
    N('Moss goes up the hill without stopping, and sits with his back to the Grove.'),
    N('The frost has gone from the grass. It doesn’t matter now. Your hands are cold. They will be cold from now on.'),
    N('When you go to the gate to look down the lane, it swings open before you touch it. It doesn’t make a sound.'),
  ]),
  S('c10-safe-sable', [
    N('Sable steps down into the warm water, up to her chest. The gold light comes up round her.'),
    N('She lowers her head to let the stone go. And stops.'),
    N('She can’t. Her jaw won’t open. She stands in the water with the stone in her mouth, shaking, and the frost creeps back up her face.'),
    N('You know what it is telling her. That she will never be hungry again. Never cold, never thrown, never waiting in a pen for the next bad thing.'),
    N('It is telling her the one thing nobody else ever promised her.'),
    N('Sable looks at you. And for the first and only time in her life, she speaks.'),
    SABLE('…safe.', 'soft'),
    N('It is the stone’s word. It is in her voice. You will never know which of them meant it.'),
    N('She does not let go.'),
  ]),
  S('c10-safe-moss', [
    N('Moss steps down into the warm water. The gold light comes up round him, and through him.'),
    N('He bends his head to let the stone go. And stops.'),
    MOSS('…Oh.', 'shock'),
    MOSS('It’s her voice. It’s using her voice.', 'soft'),
    MOSS('It sounds like Cinder on the last warm day before the White Year. Calling me in out of the rain.', 'sad'),
    MOSS('Safe, she says. Come in where it’s safe.', 'sad', 'down'),
    MOSS('I loved her. I can’t put her down.', 'sad', 'down'),
    N('He stands in the water with the stone in his mouth, and the frost creeps back up his face, and he does not move.'),
  ]),
  S(
    'c10-wisp',
    [
      N('Behind you, on the ledge, something has followed you all the way here. Very quietly, for once in its life.'),
      N('A thin grey shape with a torn ear goes past your boots like a thrown stone.'),
      WISP('Hsss! Mine!', 'angry'),
      N('He hits the shallows and snatches the shard away, quick as a theft, which it is.'),
      WISP('mine — warm — mine —', 'shock'),
      N('For one moment he holds it: the warmest thing he has ever seen. His whole thin face is joy.'),
      N('Then his back feet go from under him on the slick stone, and he tumbles into the Wellspring, stone and all.'),
      N('The water closes over him.'),
      ...STONE_UNMADE,
      N('In the shallows, the one who carried it stands blinking, the frost melting off its face, drip by drip.'),
      N('The water is still. And Wisp is gone.'),
    ],
    { set: { stoneUnmadeBy: 'wisp' } },
  ),
  S(
    'c10-moss-walks',
    [
      N('Moss wades in beside her. He is so faint now that the gold light shines straight through him.'),
      MOSS('Give it here, grey one. You’ve carried enough.', 'soft'),
      N('He puts his face very close to hers, the way Luna did. Forehead to forehead.'),
      N('And Sable’s jaw opens, and the stone drops. Not to the water. To him.'),
      N('She stumbles back out of the shallows and comes to you, soaking, and leans her whole weight against your shin.'),
      MOSS('There.', 'soft'),
      ...MOSS_GOES_IN,
    ],
    { set: { stoneUnmadeBy: 'moss' } },
  ),
  S(
    'c10-moss-walks-bearer',
    [
      N('Moss stands in the water with Cinder’s voice in his mouth. Then, slowly, he turns his head and looks at you.'),
      MOSS('I can’t put her down.', 'sad', 'down'),
      MOSS('So I won’t. I’ll carry her home instead. That is what you do, with a friend who has stayed out too late.', 'soft', 'down'),
      ...MOSS_GOES_IN,
    ],
    { set: { stoneUnmadeBy: 'moss' } },
  ),
  S('c10-bank-wisp', [
    N('You sit down on the warm rock at the edge of the water. When you don’t know what to do, sit down next to them and wait.'),
    N('So you wait. Moss sits down beside you and says nothing, which is how he says most things.'),
    N('The light in the water sinks, slowly, and goes out. Nothing comes up.'),
    MOSS('He wanted it so much. I always thought that was the worst thing about him.', 'soft'),
    ...BANK_DAWN,
    N('And there, on the far side of the pool, curled in a hollow of warm stone, is Wisp.'),
    N('He is asleep. He is grey, and he will be grey always. His torn ear lies flat against his head.'),
    N('And for the first time since you have known him, he is not trembling.'),
    MOSS('…Well.', 'soft'),
    MOSS('I was wrong about him. I am nearly never wrong. Don’t tell Hazel.', 'happy', 'chest'),
    N('You carry him home. He doesn’t bite you. He doesn’t even wake up.'),
  ]),
  S(
    'c10-bank-moss-returned',
    [
      ...BANK_WAIT,
      N('So you tell her. The first morning on the hill: “…You lift and push.” I bruise like fruit. The pale one’s shoelace.'),
      N('The afternoons you sat with him and said nothing at all. There were a lot of those. You find you remember every one.'),
      N('Marina laughs in the right places. You talk until your voice goes. Then you just remember, which is quieter, and the same.'),
      ...BANK_DAWN,
      N('Something breaks the surface. Small, and grey, and very, very thin.'),
      N('Moss climbs out onto the bank, slowly, the way he climbs everything, and sits, and shakes his ears.'),
      MOSS('You were very loud.', 'soft'),
      MOSS('All of you. I could hear you from the bottom.', 'happy'),
      N('He is thinner. The light goes through him in places it didn’t before. But he is here, and you can see him, and he is wet and cross.'),
      MOSS('Don’t pick me up. I mean it.', 'think', 'chest'),
      MOSS('…No. Go on, then.', 'soft'),
    ],
    { set: { mossReturned: true } },
  ),
  S(
    'c10-bank-moss-gone',
    [
      ...BANK_WAIT,
      N('So you tell her. The first morning on the hill: “…You lift and push.” I bruise like fruit. The pale one’s shoelace.'),
      N('And then you can’t think what else. You didn’t sit with him as often as you meant to. You thought there would be time.'),
      N('Marina doesn’t say anything. She just stays, which is the same thing.'),
      ...BANK_DAWN,
      N('Nothing comes up.'),
      N('The water is warm and smooth, and lit very faintly from below, and nothing comes up out of it.'),
      N('You wait anyway, until Marina puts her hand on your shoulder. Then a little longer.'),
      MARINA('He was the oldest thing in this valley. Older than the trees, Hazel used to say.', 'sad'),
      MARINA('He knew the way.', 'soft'),
    ],
    { set: { mossReturned: false } },
  ),
  S('c10-dawn', [
    N('You come out from behind the falls into the first light. The water is roaring again, white and ordinary.'),
    N('Below you the whole valley is frosted silver, and in the middle of it, small and gold, the Grove.'),
    N('Three lanterns, still burning. They held them. All night long, they held them.'),
    N('The fourth is dark. Ember has her arms round it anyway.'),
    N('And as you watch, the sun comes over the ridge, and the fourth lantern, by the long grass, which has only ever flickered…'),
    N('…steadies. Brightens. Burns.'),
    N('Nobody lit it. For the first time in twenty-two years, it has lit itself.'),
    N('By the time you get home the frost has gone. There is dew instead, and the whole Grove smells of spring, in the middle of winter.'),
    SPARKS('I didn’t touch it! I want that on the record. I did not touch it.', 'shock'),
    PIXEL('She didn’t. I was watching her hands. I’m always watching her hands.', 'happy'),
    N('Somebody’s soup has frozen solid in its cup overnight. Sparks tips it out, a perfect brown puck, and skims it across the last of the pond ice.'),
    N('It goes a very long way. Everyone watches it go. Nobody can think of a single reason why it’s the funniest thing they have ever seen.'),
    N('Ember is still holding the long-grass post, coat and all. She doesn’t let go for a while after she needn’t.'),
  ]),
  S('c10-moss-stays', [
    N('Moss walks to the foot of the hill and sits down, carefully, like something that has decided to.'),
    N('He looks at the Keepers: red-eyed, frozen, grinning, every one of them holding a lantern burnt down to the stub.'),
    MOSS('Hazel stood there. You stand there. The chin is the same. The hands are slower. That’s better, actually.', 'soft'),
    MOSS('I’ve decided. I’ll stay a while. Someone has to tell the pale one about his shoelaces.', undefined, 'chest'),
    BYTE('They are TIED.'),
    MOSS('Are they.'),
    N('Byte looks down. Byte looks up. Byte goes very pale, even for Byte.'),
    BYTE('…I heard that. I heard him. That was him.', 'shock'),
    CLOVER('We sat still long enough. All night. Of course we did.', 'happy'),
    N('Byte looks at his shoelace for a long moment. Then he kneels down in the wet grass and ties it, very carefully.'),
    N('Nobody laughs. And then everybody does, the whole Grove, until Clover has to sit down.'),
  ]),
  S('c10-moss-fades', [
    N('Moss stops at the foot of the hill. In the morning light you can hardly see him. He is mostly a place where the light bends.'),
    MOSS('That’s done, then. All four lit. I wanted to see it once more.', 'soft'),
    MOSS('I’m going up now, I think. Not because of anything. Because it’s time, and I’m tired, and the view is good.', 'soft', 'chest'),
    N('You kneel down by him. You want to say something. You don’t know what.'),
    MOSS('Don’t be dramatic about it. That’s Hazel’s. She won’t mind me borrowing it.', 'happy'),
    MOSS('Tell the pale one his shoelace is untied.', 'soft'),
    N('You tell Byte. Byte looks down. It is. He doesn’t tie it.'),
    N('Moss goes up the hill path, slowly, the way he climbs everything. He doesn’t look back. He never did like a fuss.'),
    N('Halfway, he stops, as if someone coming down has said his name.'),
  ]),
  S('c10-moss-mourned', [
    N('You come in at the gate: lift and push. Everyone looks at you, and then behind you, and then at you again.'),
    N('You shake your head.'),
    N('Nobody says anything. Clover sits down where she is, in the wet grass, with her lantern in her lap.'),
    N('Byte looks down at his shoelace. It’s untied. He leaves it.'),
    DUSTY('Love them anyway. Love them harder because of it. I said that. I meant it. I just didn’t mean him.', 'sad'),
    N('On the hill, by the flat stone where he always sat, there is a flower that wasn’t there yesterday.'),
  ]),
  S('c10-moss-light', [
    N('Something small and pale comes drifting down on the morning air, slow as a seed.'),
    N('It settles above Sable’s head, beside her own dark one.'),
    N('Two little lights now. One dark, one pale. Sable goes cross-eyed trying to look at both.'),
    LUNA('Oh. He left you something, sweetheart.', 'soft'),
  ]),
  S('c10-close', [
    N('The sun is up. The lanterns are burning down. The Keepers stand about in the wet grass, too tired to go home, and not one of them willing to.'),
    N('And on the hill path, coming down, there is a lantern you did not light.'),
    N('It comes slowly. It stops, now and then, the way someone stops who needs to catch their breath and won’t admit it.'),
    N('Fern sees it first. She puts her hand over her mouth.'),
    N('Then Luna. Then Clover, who starts to cry before she even knows why.'),
    N('Nobody runs to meet it. Somehow everybody knows not to. You all just stand there, and let it come.'),
    N('The lantern reaches the foot of the hill. The person carrying it is small and wrapped in three coats, and her boots are tied with string.'),
    N('In the crook of her other arm, something is asleep. A very thin grey Nubbin, no bigger than a fist.'),
    N('She looks at the Grove. At the four posts. At all of you, holding yours.'),
    HAZEL('Well. Look at you all.', 'soft'),
    N('Then she finds you among them, and stops looking for anyone else.'),
    N('It is her. Of course it is her.'),
  ]),
  S('c10-bramble', [
    FERN('That ear. The way it folds over at the tip. That’s Bramble’s ear.', 'shock'),
    HAZEL('Found her at the edge of the ring, under a root. Her mother runs the place. Terrible manners. I gather you’ve met.', 'happy'),
    FERN('Her mother was mine. Once.', 'soft'),
    N('Fern puts out one finger and touches the folded ear, very lightly. The thin grey Nubbin sighs in its sleep, and leans into it.'),
  ]),

  // ================================================================ chapter 11: Hazel
  S('c11-open', [
    N('She is smaller than you remember. Everyone is, eventually.'),
    N('Close to, her coats are patched at the elbows, and she smells of woodsmoke and wet leaves and the Hollow.'),
    N('She looks at you for a long moment. Then she puts her free hand on your face and turns it to the light, the way she did when you’d been in a hedge.'),
    HAZEL('There’s the chin.', 'soft'),
    HAZEL('You lit the lanterns. I could see them from the Hollow, all night. Four of them.', 'soft'),
    HAZEL('I thought: either that’s my grandchild, or Sparks has finally blown the whole place up.', 'happy'),
    SPARKS('That’s fair. That is extremely fair.', 'happy'),
    N('Byte is standing very straight with his clipboard, and his face is wet.'),
    HAZEL('Byte, love. You’re crying.', 'soft'),
    BYTE('Condensation.', 'think'),
    HAZEL('Of course it is.', 'happy', 'nod'),
    N('She sits down on the bench by the cottage door, quite suddenly, as if her legs have made the decision for her.'),
    HAZEL('I’m not staying long. I want to be clear about that now, so nobody gets dramatic later.', 'think', 'chest'),
    HAZEL('I wrote that I’d gone up the hill. I was optimistic about the timing.', 'happy'),
    HAZEL('The doctor gave me a year and I’ve had fourteen months, which I will be mentioning to him.', 'happy'),
    HAZEL('I spent them in the Hollow. Feeding anyone who’d let me. Following the cold up the valley. Waiting for him to walk it home.', 'soft'),
    HAZEL('He couldn’t. You did. I’m going to need a minute with that.', 'soft'),
    N('She doesn’t take a minute. She takes about four seconds, and blows her nose on a handkerchief that has seen things, and that is that.'),
    N('The thin grey Nubbin in her arm stirs. It is so thin you can see the morning through its ears.'),
    HAZEL('This one I found the night before last. She’d stopped eating.', 'soft'),
    HAZEL('She took a bit of apple off my thumb at sunrise. Took two days. Worth it.', 'soft'),
    N('She looks round at the Keepers, all of them still here, holding lanterns burnt to stubs, too tired to go home.'),
    HAZEL('Look at you. Up all night in the cold, for an old stone and an older Nubbin and a garden that isn’t even yours.', 'soft', 'point'),
    CLOVER('It’s a bit ours.', 'sad', 'down'),
    HAZEL('Yes, Clover. It is. That’s rather the point.', 'soft', 'nod'),
    HAZEL('Go on. Go and talk to them. Properly. Not about me.'),
    HAZEL('A Grove isn’t the Nubbins, love. It’s the people who show up when the lanterns are lit.', 'soft'),
  ]),
  S('c11-moss-here', [
    N('Moss has come down from the hill. He sits by Hazel’s boot and looks up at her.'),
    HAZEL('Hello, old thing.', 'soft'),
    MOSS('You’re late.', 'think'),
    HAZEL('I’m always late. You’re thinner.', 'soft', 'chest'),
    MOSS('You’re late, and I’m thinner. We’re even.', 'soft'),
    N('She laughs, and has to stop, and holds her side, and laughs anyway.'),
    N('Then she puts her hand on his head, the way she did every evening for forty years. He shuts his eyes.'),
  ]),
  S('c11-moss-kept', [
    N('Moss doesn’t come down. He sits on the hill with his back to the Grove, where he has sat since the Long Night.'),
    N('Hazel looks up at him. After a long time he turns his head and looks back at her, and then away.'),
    HAZEL('Hello, old thing. Like that, is it.', 'sad', 'down'),
  ]),
  S('c11-moss-gone', [
    N('Hazel looks up the hill, at the place where he always sat. She doesn’t ask.'),
    HAZEL('I know, love. I knew on the hill, coming down. The air was different.', 'soft'),
    ...MOSS_GONE_TAIL,
  ]),
  S('c11-moss-passed', [
    N('Hazel looks up the hill, at the place where he always sat. She doesn’t ask.'),
    HAZEL('I passed him on the path. He told me I was late.', 'soft', 'down'),
    ...MOSS_GONE_TAIL,
  ]),
  S('c11-sable', [
    N('Sable comes out of the long grass, looks at Hazel for a long time, and then walks straight past her and leans her whole weight on your shin.'),
    HAZEL('Well. That’s me told.', 'happy'),
    HAZEL('That one took longer than two months, I’ll bet.', 'soft'),
    N('You think of the first night, and of every night since. You nod.'),
    HAZEL('Worth it.', 'soft'),
  ]),
  S('c11-cold-hands', [
    N('Hazel takes your hand to stand up. Then she doesn’t stand up.'),
    HAZEL('Your hands are cold, love.', 'think'),
    N('You take your hand back and put it on your coat, over the breast pocket. You don’t mean to. It just goes there.'),
    N('Hazel watches it go. She has seen someone do that before. A long time ago, in this garden.'),
    HAZEL('…Ah.', 'sad', 'down'),
    N('She doesn’t say anything else. Her silences were always the loudest thing about her.'),
  ]),
  S('c11-close', [
    N('Days go by like that. Hazel sleeps a lot, and wakes up for the good bits.'),
    HAZEL('Good. They like you. Sparks likes everyone, that doesn’t count, but Ember likes you, and Ember doesn’t like anyone.', 'happy', 'nod'),
    HAZEL('I’m not even sure Ember likes Ember.', 'happy', 'chest'),
    EMBER('I can hear you.', 'angry'),
    HAZEL('I know, dear.', 'happy'),
    HAZEL('Sit with me. Here. By the pond. Don’t say anything.', 'soft'),
    N('You sit. The ice on the pond is gone. The water is black and still and has the whole evening sky in it.'),
    N('The thin grey Nubbin wakes, looks at you, and goes back to sleep.'),
    N('Nobody says anything. The lanterns burn. An owl says something, once, and then thinks better of it.'),
    HAZEL('I used to sit here and go over everything I’d got wrong. Forty years. There’s a lot.', 'soft'),
    HAZEL('The ones I lost. The tablets I left lying about. Him. I taught him everything except the one thing.', 'sad'),
    HAZEL('Then one evening I stopped going over it and just sat. That was better. That was the whole trick, it turned out.', 'soft'),
    N('She takes your hand. Hers is warm, and very light, like something that is mostly air now.'),
    HAZEL('Tomorrow I want to see the whole Grove. Every post, every tree, every last grub in the pond.', 'think'),
    HAZEL('Then I’m going to go up the hill and have a very long sit-down, and you are not to be dramatic about it.', 'soft'),
    N('You don’t say anything. You are getting good at it.'),
  ]),
  S('c11-gate', [
    N('When you look up from the pond, he is back at the gate.'),
    N('Corvin. No grey coat. A brown one, too big, either borrowed or very old.'),
    N('He tries the latch once, for form’s sake, and it sticks. Then he folds his arms on the top bar, like a man settling in.'),
    N('Beside you, Hazel doesn’t turn round. But she has stopped breathing, just for a moment, to listen.'),
    HAZEL('Don’t look at me, love. I’ve done my part. It’s your gate now.', 'soft'),
    HAZEL('He said till first light. He’ll mean it. Meaning things was never his trouble.', 'think'),
  ], {
    choices: [
      {
        id: 'gate-leave',
        label: 'Stay where you are.',
        then: [
          N('You stay where you are. In the dark the gate creaks once more, and then is quiet. But you don’t hear him go.'),
        ],
      },
      {
        id: 'gate-cruel',
        label: 'It’s freezing. Isn’t that cruel?',
        then: [
          HAZEL('It would be, if anyone had asked him to. Nobody did. He chose the hour himself.', 'think'),
          HAZEL('Let him have chosen something, love. It’s been a long time.', 'soft'),
          N('You stay. In the dark the gate creaks once more, and then is quiet. But you don’t hear him go.'),
        ],
      },
      {
        id: 'gate-tea',
        label: 'Take him a cup of tea. Leave the gate shut.',
        then: [
          HAZEL('…Oh, you’re worse than me.', 'happy'),
          HAZEL('Go on, then. The cup by the stove. The one that’s turned upside down.', 'soft'),
          N('You carry it down and pass it over the top bar. He takes it in both hands. Neither of you says anything.'),
          N('In the morning the cup is on the gatepost, rinsed in the stream, and turned upside down.'),
        ],
      },
    ],
  }),

  // ================================================================ chapter 12: Keepers
  S(
    'c12-open',
    [
      N(
        'Morning. Cold and very bright. Every Keeper is here, and every Nubbin. Nobody planned it. Everybody just came.',
      ),
      N(
        'Sparks has brought a cake, which has collapsed on one side. Pixel has fixed the cake. It is still collapsed, but now it lights up.',
      ),
      N(
        'Fern has made lantern buns, and for the first time in living memory they have come out. She keeps showing people one, as evidence.',
      ),
      N(
        'Dusty is digging a new bed by the old wall, for reasons they won’t explain. Nova has brought seeds from somewhere you’ve never heard of.',
      ),
      N(
        'Clover is crying already, and says it’s the cold. Byte has a clipboard and has not written anything on it.',
      ),
      N(
        'Pixel and Byte argue about where Hazel would want them to stand. They settle it by standing there together.',
      ),
      N(
        'Marina sits on the edge of the pond with her feet in the water, which is freezing, and says it’s lovely.',
      ),
      N(
        'Ember stands by the gate with Ash. At first light Ash ran at the gate, the way she used to. Not full tilt. Half. She bounced off it.',
      ),
      N('Ember has told nobody. Everybody knows.'),
      N('Hazel walks the Grove. Slowly. She touches each lantern post as she passes, the way you touch the shoulder of someone you are about to leave.'),
      N('At the fourth post, the long grass, she stands a long time.'),
      HAZEL('And the long grass. Cinder’s.', 'soft'),
      HAZEL('She loved them too, you know. That was never the trouble.', 'sad', 'down'),
      N('Then she comes to the pond, and stands in the place where she doesn’t say anything, and waits for you to.'),
      HAZEL('It’s yours now. Properly.', 'soft'),
      HAZEL('I had forty years of it. I shut the gate when I was frightened and opened it when I was brave, and I was wrong both ways about half the time.', 'think', 'chest'),
      HAZEL('So. Tell me. What is it going to be?', 'soft'),
    ],
    {
      choices: [
        {
          id: 'keep',
          label: 'A home. For all of them. I’ll keep the gate stuck.',
          set: { finalChoice: 'keep' },
          then: [
            HAZEL('Lift and push. Good.', 'happy'),
            HAZEL('It sticks so you hear who comes back. That was always the point of it. I never told anyone that.', 'soft'),
            HAZEL('Keep it stuck, love. Keep listening.', 'soft'),
          ],
        },
        {
          id: 'free',
          label: 'Open. No gate. They stay if they want to.',
          set: { finalChoice: 'free', letThemGo: true },
          then: [
            HAZEL('…That’s not how I did it.', 'think'),
            HAZEL('It might be how it should be done. Go on, then. Let’s see who stays.', 'soft'),
            N('You lift the gate off its hinges. It is heavier than you thought. Dusty helps. You lean it against the wall, where the ivy can have it.'),
            N('For a long moment, nobody goes anywhere. Then a stray wanders out into the lane, sniffs the air, and wanders straight back in.'),
            HAZEL('Ha.', 'happy'),
          ],
        },
      ],
    },
  ),
  S('c12-foot-told', [
    N('When Hazel stands up from the bench, everybody stands up.'),
    N('They know. You told them, the way she asked, and they have been dreadful about it, the way she said they would be.'),
    N('They walk with her as far as the foot of the hill. Nobody says anything. Nobody needs to.'),
    N('At the bottom of the path she turns and looks at them, one after another, as if she is counting.'),
    HAZEL('That’s far enough.', 'soft'),
    HAZEL('Go on. Go home. Light something.', 'soft'),
    N('They stop. They don’t go home. They stay at the foot of the hill, all of them, holding lanterns in broad daylight, and watch.'),
  ]),
  S('c12-foot-secret', [
    N('When Hazel gets up from the bench, nobody notices. Sparks is arguing with Pixel about the cake. Fern has lost a glove.'),
    N('Hazel catches your eye across the Grove, and winks.'),
    HAZEL('Not a word. They’d only fuss.', 'soft'),
    N('She takes her lantern from the step, and her three coats, and walks to the foot of the hill unhurried, as if she is going to look at a tree.'),
  ]),
  S('c12-walk-you', [
    HAZEL('Come on, then. Arm.', 'soft'),
    N('She takes your arm. She doesn’t lean. She just holds on.'),
    N('You go up slowly. Past Fossil’s flower. Past Briar’s, the first one, small and yellow by the big stone, open even now, in winter.'),
    HAZEL('I used to come up here and tell them what I’d done that week. Briar mostly. She liked the bad bits best.', 'happy'),
    HAZEL('Come and tell them about you, sometimes. Not me. You. Let them know how it’s going.', 'soft'),
    ...WALK_TOP,
    HAZEL('Right. Off you go.', 'soft', 'nod'),
    HAZEL('Don’t look back on the way down. It turns everything into a scene.', 'happy'),
    N('You get up. You go down.'),
    N('You look back once. Of course you do.'),
    N('She isn’t looking. She has one hand up, waving, without turning round, the way she always did from the gate.'),
  ]),
  S('c12-walk-moss', [
    N('Moss is sitting on the first stone of the hill path. You don’t know how long he has been there. Longer than you, probably.'),
    MOSS('I’m coming. Don’t argue.', 'think', 'chest'),
    HAZEL('I wasn’t going to argue.', 'soft'),
    MOSS('You were. You had the chin out.', 'soft'),
    N('He climbs onto her shoulder, slowly, the way he climbs everything. She doesn’t stagger. He weighs about as much as a memory.'),
    HAZEL('This is as far as you come, love.', 'soft'),
    N('So you stop at the foot. You watch them go up together, small and slow, the lantern swinging.'),
    N('Halfway, she stops for breath. He says something in her ear. She laughs so hard she has to sit down on the path.'),
    N('At the top they sit: an old woman and an old Nubbin, looking out over the Grove, the way they did when she was young and he’d just decided she was worth it.'),
    MOSS('I’ll decide at the top. Go home. Light something.', 'soft'),
    N('You wait at the foot until her lantern is the only light on the hill.'),
    N('He doesn’t come down. Not tonight.'),
  ]),
  S('c12-walk-sable', [
    N('Sable is standing in the long grass at the foot of the hill path. She isn’t looking at you. She’s looking at Hazel.'),
    HAZEL('Hello, grey one.', 'soft'),
    N('Sable walks to Hazel’s boots, and then one step past them, up the path. Then she stops, and looks back.'),
    HAZEL('Oh. She’s taking me.', 'soft'),
    HAZEL('Well. I’ve been taken places by worse.', 'happy'),
    N('You stop at the foot. They go up together: the old woman with the lantern, and the small grey shape ahead of her, waiting at every bend.'),
    N('Two steps ahead. Never more. She has had a lot of practice at two steps.'),
    N('At the top, Sable sits down beside her. You can see them for a long time, the lantern and the dark, side by side.'),
    N('After dusk, a small grey shape comes down the path alone, very slowly.'),
    N('She doesn’t go to her place in the long grass. She comes to the cottage step, and sits on it, and waits for you.'),
    N('She has never once walked towards a Keeper’s door.'),
  ]),
  S('c12-walk-corvin', [
    N('Corvin is standing by the hedge at the foot of the hill, a long way off, the way he has stood at the edge of everything since he came back.'),
    HAZEL('Well, don’t stand there like a heron. Come and take the lantern.', 'soft'),
    HAZEL('You used to carry it for me. When you were twenty-two and knew everything.', 'soft'),
    CORVIN('…I used to.', 'soft'),
    N('He comes. He takes it. His hands are not blue any more. They are only a man’s hands, a little red with cold, and they are steady.'),
    N('You stop at the foot. You watch them go: the old woman on the arm of her old apprentice, stopping when she needs to.'),
    N('He waits every time. He does not hurry her once.'),
    N('It is a long while before he comes down. When he does, his hands are empty, and his face is wet, and he doesn’t try to hide it.'),
    N('He left the lantern with her, burning. He sits down by the pond, a little way off, and says nothing. He is getting better at it.'),
  ]),
  S('c12-walk-alone', [
    N('Later, when the others are busy with the cake, Hazel stands up from the bench and picks up her lantern.'),
    HAZEL('Walk me up, love.', 'soft'),
    N('You know what she means. You have known since the letter. Perhaps since the gate.'),
    N('At the foot of the hill she takes your arm. She doesn’t lean. She just holds on.'),
    N('You go up slowly, past Fossil’s flower, and Briar’s, the first one, small and yellow by the big stone.'),
    ...WALK_TOP,
    HAZEL('Now it’s yours. Go on down. And don’t look back; it turns everything into a scene.', 'happy'),
    N('You go down. You look back once. Of course you do.'),
    N('She has one hand up, waving, without turning round, the way she always did from the gate.'),
  ]),
  S('c12-close', [
    N('Dusk. You come back into the Grove.'),
    N('The Keepers are all still here. Nobody has gone home. Somebody has lit the lanterns, all four, without being asked.'),
    N('Nobody asks you anything. Clover gives you soup. Fern gives you her other glove; she has found the first one.'),
    N('Somebody has eaten the cake, collapsed side and all. The plate on the bench is still faintly lit from inside.'),
    N('You stand by the pond, in the place where Hazel didn’t say anything. Everyone else stands somewhere too.'),
    N('At the top of the hill, small and gold and steady, her lantern is burning.'),
    N('It burns all night. You know because you watch it. Everybody does, on and off, in turns, without anyone arranging it.'),
    N('Sparks falls asleep sitting up, holding her lantern. Nobody takes it off her.'),
    N('Towards morning somebody starts the song, very quietly, and stops after the chorus. That is enough. Everyone knows the rest.'),
    N('…'),
    N('In the morning it has gone out.'),
    N('And on the hill, near Briar’s, there is a new flower: small, brisk, a bit untidy, and turned very firmly towards the Grove.'),
  ]),

  // ================================================================ endings
  // Each ending: end-<id>, then any body variant, then the epilogue variants, then end-<id>-last.

  S('end-hazels-grove', [
    N('HAZEL’S GROVE'),
    N('The gate sticks. Everyone who matters knows to lift and push.'),
    ...HAZELS_GROVE_BODY,
  ]),
  S('end-hazels-grove-open', [
    N('HAZEL’S GROVE'),
    N('There is no gate any more. Everyone who matters comes in anyway, and most of them still lift and push at the air where it was.'),
    ...HAZELS_GROVE_BODY,
  ]),
  S('end-hazels-grove-last', [
    N('Sometimes, by the pond, in the place where nobody says anything, you can very nearly hear her.'),
    HAZEL('Told you. Love is a method.', 'happy'),
  ]),

  S('end-eternal-dawn', [
    N('ETERNAL DAWN'),
    N('One of yours has stopped ageing. You noticed it in the spring: the way it sat, carefully, like something that had decided to.'),
    N('It sits on the western hill now, and watches the gate, and will not come down until it decides you are worth it. It already has.'),
  ]),
  S('end-eternal-dawn-moss', [
    N('Moss looked at it for a long time. Then he climbed up and sat beside it.'),
    MOSS('Someone has to remember the pale one’s shoelaces. It isn’t going to be me for ever. Good. That’s good.', 'soft'),
    N('Two of them on the hill now. One talks. The other is learning how.'),
  ]),
  S('end-eternal-dawn-nomoss', [
    N('It sits in the exact place where Moss used to sit. Nobody taught it to. Nobody had to.'),
    N('Byte says it’s a coincidence. Byte has also started tying his shoelaces twice.'),
  ]),
  S('end-eternal-dawn-last', [
    N('On Lantern Night it comes down for an hour and sits among you all, and looks at each of you in turn, very carefully.'),
    N('As if it is learning you by heart. It is. That is what they are for.'),
  ]),

  S('end-shadow-keeper', [
    N('THE SHADOW’S KEEPER'),
    N('Grey Nubbins find their way to your gate now. Word gets round, in whatever way word gets round among creatures that do not speak.'),
    N('They come out of the Hollow, and down from the Circuit, and in from the long grass: thin and quiet, waiting for the next bad thing.'),
    N('Sable meets each one at the edge and sits with it. She does not come closer. She does not run. She shows them how.'),
    N('Ash sits with her, most days. Two grey shapes in the long grass. The new ones go to both.'),
  ]),
  S('end-shadow-keeper-last', [
    N('Clover tells every new Keeper the same thing, standing at the edge with a bag of fruit.'),
    CLOVER('The grey stays. You can only make it lighter.', 'soft'),
    N('Sable is the proof. She is so light now. You could carry her anywhere.'),
  ]),

  S('end-moss-sleeps', [
    N('MOSS SLEEPS'),
    N('Moss did not come back. By spring his flower by the flat stone was fully open, and the wind goes through it the way it went through him.'),
    N('Sable carries his light now. Nobody knows how. It floats beside hers, pale and small, and when the lanterns are lit, it flickers.'),
    N('You sit by his flower in the afternoons and tell it things. You were never very good at sitting still with him, when he was here.'),
    N('You are better at it now. It is too late, and you do it anyway.'),
  ]),
  S('end-moss-sleeps-last', [
    LUNA('He’s not gone. He’s just remembered by fewer people. That’s all fading is.', 'soft'),
    LUNA('Remember him louder.', 'soft'),
  ]),

  S('end-wild-grove', [
    N('WILD GROVE'),
    N('There is no gate any more. Some stayed. Most didn’t. The grey ones you scattered from Corvin’s garden come and go through the Hollow.'),
    N('You leave fruit, and some of it is eaten.'),
    N('Most weeks you go into the Hollow with a lantern and a bag of fruit and the stubborn chin. Some of them let you near now.'),
    N('A small grey one with a nicked ear let you touch it this spring. Took two months. Worth it.'),
  ]),
  S('end-wild-grove-last', [
    NOVA('I saw you out there. You didn’t wave. You were busy.', 'soft'),
    NOVA('You looked… like her.', 'soft'),
  ]),

  S('end-empty-lantern', [
    N('THE EMPTY LANTERN'),
    N('Sable never came back. Luna still leaves fruit at the edge every night. Some mornings it is gone, and nobody asks who took it.'),
    N('On Lantern Night you light all four posts. Then you light a fifth, a small one, and set it at the very edge of the long grass, facing out.'),
    N('For anyone who might be watching from it. For anyone who might want to know the way.'),
  ]),
  S('end-empty-lantern-last', [
    N('Hazel wrote it in her first letter. You have it by heart.'),
    HAZEL('“When you don’t know what to do, sit down next to them and wait.”', 'soft'),
    N('You are still waiting. That counts. That counts for a lot.'),
  ]),

  S('end-collector', [N('THE COLLECTOR')]),
  S('end-collector-sold', [
    N('Two hundred Shells buys a lot of eggs. They hatch, and they are fast, and they are grey by autumn, every one.'),
    N('You never went looking for the first one when the pens opened. You told yourself it was doing well. Quiet.'),
    N('You told yourself those were the same thing.'),
    CORVIN('I told you. Everyone sells, eventually. I’m almost sorry I was right.', 'think'),
  ]),
  S('end-collector-kept', [
    N('Nothing in your Grove is ever hurt now. Nothing is hungry, or lost, or frightened. Nothing runs into the dark.'),
    N('They sit in the grass in the sun, all of them, quite still. They are grey by spring, every one. They are perfectly safe.'),
    N('Moss stayed on the hill after Hazel went up. He never came down again.'),
    N('Corvin came once. He stood in the lane and looked at your hand, resting on your coat, over the pocket.'),
    CORVIN('I’m sorry. I am so sorry. I know exactly how sorry.', 'sad', 'chest'),
    N('Your hands are always cold now. You keep meaning to mind.'),
  ]),
  S('end-collector-last', [
    N('The gate opens by itself now. It has stopped sticking. You find that you miss it.'),
  ]),

  S('end-long-road', [
    N('THE LONG ROAD'),
    N('Sable is still here. Still grey. Still two steps away, never one. She eats what you leave and sleeps near, not next to.'),
    N('Hazel said two months for an ear. It has been longer than that. You sit down next to her every evening and wait.'),
    N('You have stopped counting, which Hazel would have said was the point.'),
    N('Some evenings she is one and a half steps away. You don’t say anything. You don’t want to frighten it.'),
    N('Pixel’s meter by the door still says MAYBE. Pixel offered to repaint it. You said no. Maybe is a good word. It has room in it.'),
  ]),
  S('end-long-road-last', [
    CLOVER('She stayed. Out of the whole valley, she picked this Grove, and she stayed.', 'soft'),
    CLOVER('Don’t you dare call that nothing.', 'soft'),
  ]),

  // ---------------------------------------------------------------- epilogue variants: Wisp (S2)
  S('end-epi-wisp-spared', [
    N('Wisp lives under the cottage step. He is grey, and will be grey always, and he has not trembled once since the Long Night.'),
    N('He still steals. One warm thing a day: a sock off the line, a bun off the sill, the sunny end of the step. He gives most of it away.'),
    N('He still hisses at hands. Then he climbs into them.'),
    WISP('…warm.', 'soft'),
  ]),
  S('end-epi-wisp-sable', [
    N('Wisp sleeps in the long grass, on the exact spot where Sable once pushed half her fruit across to him.'),
    N('He comes in for breakfast. He doesn’t come in any further. Some mornings, now, he stays to wash his face in the sun.'),
    WISP('…ours.', 'soft'),
  ]),
  S('end-epi-wisp-kept', [
    N('Wisp comes every evening and sits at your feet, and looks at your pocket.'),
    N('He never tries to take it. He just looks, and shakes. In the morning he is gone, and in the evening he is back.'),
    WISP('…warm. warm.', 'sad', 'down'),
    N('It isn’t. You could tell him. You never do.'),
  ]),
  S('end-epi-wisp-driven', [
    N('You never saw Wisp again.'),
    N('Once, from the ridge, you thought you did: thin and grey, one ear torn to a fringe, sitting where the paths stop, watching the Grove.'),
    N('You waved. When you looked again, he was gone. You don’t know if he saw.'),
    N('You leave a little fruit at the edge of the long grass, most nights. Some of it is eaten.'),
  ]),
  S('end-epi-wisp-none', [
    N('Some nights, fruit goes missing from the edge of the long grass. Whoever takes it is thin and quick and gone before you can sit up.'),
    N('You leave a little more, the next night. Hazel would have.'),
  ]),

  // ---------------------------------------------------------------- epilogue variants: Corvin's gate (S9)
  S('end-epi-gate-family', [
    N('Corvin comes on Sundays and sits by the pond and says nothing, badly, but he is learning.'),
    N(
      'On the first Sunday he brings back a pie dish, washed, with a pie in it. It is not a good pie. Everyone has some.',
    ),
    FERN('I’ve no idea whose dish that is. It’s a lovely dish.', 'think', 'shrug'),
    N(
      'He comes in the way Hazel taught everyone, every time, as if he isn’t sure it will still work. It always does.',
    ),
    N(
      'Ember sits on the far side of the pond. She has not forgiven him. Some Sundays she passes him the teapot.',
    ),
  ]),
  S('end-epi-gate-guest', [
    N('Corvin comes when he is asked, which is not often. He knocks on the gatepost every time.'),
    N('You let him in every time. Neither of you has ever suggested he stop knocking.'),
    N('Once he brought flowers for the gatepost. You put them in a jar beside it. The gatepost did not comment.'),
  ]),
  S('end-epi-gate-shut', [
    N('Corvin doesn’t come. Some mornings there are footprints in the dew by the gatepost that stop there, and turn round.'),
    N('You never mention them. You don’t sweep them away, either.'),
  ]),
  S('end-epi-gate-none', [
    N('There is a chair by the pond that nobody sits in. Hazel put it there years ago.'),
    N('You never asked her who it was for. You leave it where it is.'),
  ]),

  // ---------------------------------------------------------------- epilogue variants: Hazel's walk (S10)
  S('end-epi-walk-you', [
    N('You walked her up. You know exactly which flower is hers.'),
    N('You go up and tell it things. Mostly the bad bits. She’d like those best.'),
  ]),
  S('end-epi-walk-moss', [
    N('Moss stayed at the top with her that night, and the next, and all the rest of the winter.'),
    N('In the spring, when her flower opened, he came down the path, thinner, and sat by the pond as if he had been gone an afternoon.'),
    MOSS('I decided.', 'soft'),
  ]),
  S('end-epi-walk-moss-stayed', [
    N('Moss rode up on her shoulder. At the top, for the first time since the Long Night, he turned round to face the Grove.'),
    N('In the spring there were two flowers up there, very close together, leaning in like old friends sharing a joke.'),
  ]),
  S('end-epi-walk-sable', [
    N('Sable walked her up, and came down alone, and sat on your step.'),
    N('She sits there every evening now, at dusk, facing the hill. When the lanterns are lit, she comes in.'),
  ]),
  S('end-epi-walk-corvin', [
    N('Corvin carried her lantern up the hill, and left it burning at the top. At first light he went back up for it.'),
    N('It hangs on the hook by the cottage door. He trims the wick himself when he comes, and won’t let anyone else touch it.'),
  ]),
  S('end-epi-walk-alone', [
    N('You walked her up alone, the way she wanted. Nobody else saw her go.'),
    N('You tell them about it, when they ask. You leave out the waving. That part is yours.'),
  ]),
  S('end-epi-told', [
    N('The whole valley walked her to the foot of the hill.'),
    N('They still meet there once a year, on the day she went up, and stand together, and say nothing, badly.'),
    N('Fern brings lantern buns. They come out every time now. She says it’s because she stopped trying so hard. Hazel would have said that was the whole trick.'),
  ]),
  S('end-epi-secret', [
    N('She left the letter under Fern’s stone on the signpost. Fern says she always knew that stone would come in useful.'),
    N('The valley found out from her letter. Clover cried on it. Sparks tried to fix it. Byte made a graph, and then wouldn’t show it to anyone.'),
    N('Then they all came up the hill that evening with lanterns, and argued about where she’d have wanted them to stand.'),
  ]),
];

export const BOOK3_ENDINGS: Record<string, { title: string; how: string }> = {
  collector: {
    title: 'The Collector',
    how: 'Sell your Nubbin to Corvin in chapter 2 and never buy anyone back, or keep the stone at the Wellspring’s edge.',
  },
  'empty-lantern': {
    title: 'The Empty Lantern',
    how: 'Lose Sable: let her trust fall under 5 for ten minutes so she runs away, and don’t win her back before the end.',
  },
  'eternal-dawn': {
    title: 'Eternal Dawn (secret)',
    how: 'Raise one of your own Nubbins to Eternal during the campaign (two rebirths, then a Normal-type evolution with a strong alignment), and end with Sable bonded.',
  },
  'wild-grove': {
    title: 'Wild Grove',
    how: 'Open the pens by force in chapter 9, then choose “Open, no gate” at the end.',
  },
  'hazels-grove': {
    title: 'Hazel’s Grove',
    how: 'Bond with Sable (trust 70+), keep Moss loved (affection 40+ when chapter 10 begins), reconcile with Corvin in chapter 9, and unmake the stone. Either final choice will do.',
  },
  'moss-sleeps': {
    title: 'Moss Sleeps',
    how: 'Bond with Sable, but let Moss fade: leave his affection under 40 when chapter 10 begins. If he walks into the Wellspring, only a loved Moss comes back.',
  },
  'shadow-keeper': {
    title: 'The Shadow’s Keeper',
    how: 'Bond with Sable and keep Moss loved, but don’t reconcile with Corvin: buy Ash back or open the pens by force in chapter 9.',
  },
  'long-road': {
    title: 'The Long Road',
    how: 'Reach the end with Sable still with you but not yet bonded (trust under 70). The default ending.',
  },
};

/** Every campaign flag Book Three sets or reads. */
export const BOOK3_FLAGS: string[] = [
  'corvin', // set c9-open: reconciled | bargained | forced (existing)
  'boughtBack', // set c9-open bargain (existing); read: collector route
  'freedByForce', // set c9-open force (existing); read by endingFor
  'soldNubbin', // read: c9-partner, c9-open-sold, c9-shard-collector, end-collector-sold (existing)
  'mossFaded', // read: set by beginChapter(10) (existing); picks bank / Moss variants
  'keptStone', // set c10-edge: true (keep) | false (unmake); read: c11-moss-kept, c11-cold-hands, end-epi-walk-moss(-stayed)
  'stoneBearer', // set c10-bearer-*: sable | moss
  'stoneUnmadeBy', // set c10-wisp / c10-moss-walks*: wisp | moss
  'mossReturned', // set c10-bank-moss-returned (true) / c10-bank-moss-gone (false)
  'wisp', // read (S2): spared | driven | sable; unset = never met
  'corvinGate', // read (S9): family | guest | shut; unset = not started
  'hazel', // read (S10): secret | told
  'walk', // read (S10): you | moss | sable | corvin; unset = no S10
  's8Reunited', // read: c10-bramble. Set by S8 when Fern finds Bramble (s8-reunion); S8 itself completes in ch11
  's9Started', // NEW. Set by S9’s first scene (s9-dusk). c11-gate itself plays only once s9-ask has been seen.
  'millLetter', // read: end-epi-mill-* (S13)
  'cinder', // read: end-epi-cinder-* (S19)
  's10Done', // read: c12-walk-alone and end-epi-walk-alone when not set
  'finalChoice', // set c12-open: keep | free (existing)
  'letThemGo', // set c12-open free (existing); read: end-hazels-grove-open
  'eternalRaised', // read: end-eternal-dawn (existing)
];

export const BOOK3_NOTES: Record<string, string> = {
  // ---------------------------------------------------------------- chapter 9
  'c9-partner':
    'Collector route only (soldNubbin && !boughtBack at the start of ch9). Plays BEFORE c9-open (queue it first in ' +
    'beginChapter(9)). Corvin’s note, the evening before. Mirrors Hazel’s letter; he calls you partner.',
  'c9-open':
    'Chapter 9 opening, Corvin’s garden, nearly midwinter, frost as in August. Ember present. Choice ids/sets/friendship ' +
    'unchanged (confront → reconciled, bargain → bargained + boughtBack, force → forced + freedByForce), so applyChoice’s ' +
    'bargain side effect still runs. Ash leaves the garden in all three branches (so S6 can open after ch9). No side-story ' +
    'options here (bible conflict 17). Verbatim: “I never made it quicker. I only made it quieter.” No numeric grey count. ' +
    'Corvin says Hazel stood at his gate in the autumn for an hour without knocking (where she was between ch8 and ch10; ' +
    'canon). Lines and choices are the shared consts C9_ARRIVE, C9_GARDEN and C9_CHOICE.',
  'c9-open-sold':
    'NEW. Plays INSTEAD of c9-open on the Collector route (soldNubbin && !boughtBack at the start of ch9): set chapter 9’s ' +
    'opening to this id, or queue it and mark c9-open seen. Identical to c9-open plus one line: your sold Nubbin in the ' +
    'second row, its number painted on its side (pays off c9-partner’s “what your two hundred Shells became” and c5-sold). ' +
    'Same choice ids and sets, so applyChoice’s c9-open bargain side effect must also run for c9-open-sold. Its own ' +
    'choice set, C9_CHOICE_SOLD, is C9_CHOICE except that bargain adds two lines after the Shells line: Corvin includes ' +
    'your old Nubbin in the two hundred, and it walks out behind Ash (the side effect brings it home).',
  'c9-shard-reconciled':
    'Plays straight after c9-open (or c9-open-sold) whenever corvin = reconciled, the Collector route included: once ' +
    'Corvin has opened his gate, he gives the tin out of remorse, not as a partner. Corvin gives you the tin. ' +
    '“I haven’t been warm in twenty-two years.” Art: frost-furred tin; Corvin’s hand tinted blue.',
  'c9-shard-bargained':
    'Plays after c9-open when corvin = bargained (this always clears the collector route, since boughtBack is set). ' +
    'He tosses the tin in with Ash’s price: “Take it. It never worked on anything that mattered.”',
  'c9-shard-forced':
    'Plays after c9-open when corvin = forced and NOT (soldNubbin && !boughtBack). He drops it in the stampede; you pick ' +
    'it up off the frozen ground. Last line: Ash following Ember home, three steps behind (she went into the trees with ' +
    'the grey tide; this is how she is at the Long Night).',
  'c9-shard-collector':
    'Plays after c9-open-sold INSTEAD of c9-shard-forced on the Collector route (soldNubbin && !boughtBack) when corvin = ' +
    'forced. That is the only Collector case it covers: reconciled plays c9-shard-reconciled, and bargained always sets ' +
    'boughtBack, which leaves the route. Corvin sees his own method in your force (quick; nobody asked) and gives the tin ' +
    'as a gift: “With this, they’ll never leave you.” The tin stops feeling cold in your hands (seed for the temptation ' +
    'in ch10). Ends, like -forced, with Ash following Ember home.',
  'c9-sable':
    'Plays after the shard variant and before c9-close if Sable is still in the world (any trust). She waited at the gate ' +
    'once before (C8_GATE, book two); this time she comes to meet you. She sniffs the tin and ' +
    'does not flinch: seeds her as the bearer. Luna present (spawn if needed).',
  'c9-close':
    'Chapter 9 closing (after corvinChoice). Back at the Grove at dusk; Marina’s line, then Moss names the shard (Cinder) ' +
    'and the plan: the Wellspring, the longest night, only the grey can carry it. The tin is buried under the Long-Grass ' +
    'post; frost spreads from the long grass towards the pond. Moss very faint (art: Moss alpha ~0.5 from here to ch10 ' +
    'dawn). All four shards home; three days to the longest night. Opens S6 (only if Ash left the garden: always true now). ' +
    'Small warmth before the cold: Fern’s pie on the step, its note calling back Marina’s “feed yourself” (c2-open). ' +
    'Moss answers why only the fourth shard, and why not long ago: the other three sleep and are kept by watching, and ' +
    'none of the wardens was grey then. Route-neutral: Hazel wanted Corvin to walk it down the lane himself; he couldn’t.',
  // ---------------------------------------------------------------- chapter 10
  'c10-open':
    'Chapter 10 opening, the longest night’s afternoon. Pond iced; Moss very faint on the hill. Verbatim “Eternals don’t ' +
    'age. We fade…”. All ten Keepers arrive (no side-story gating; Ash comes with Ember in every route). Byte cannot hear ' +
    'Moss here (the payoff is c10-moss-stays). Then the goal: light the four lanterns. ' +
    'FULL CH10 ORDER: c10-open → [c10-sable-watch] → goal lanternsAgain → c10-vigil → [c10-vigil-wisp] → timed vigil step ' +
    '(hold four lanterns, no fail state; c10-lull plays partway through it) → c10-falls → c10-bearer-sable | c10-bearer-moss → c10-ledge → c10-edge (choice). ' +
    'KEEP: c10-kept → c10-close. UNMAKE: c10-safe-sable | c10-safe-moss → c10-wisp | c10-moss-walks | ' +
    'c10-moss-walks-bearer → c10-bank-wisp | c10-bank-moss-returned | c10-bank-moss-gone → c10-dawn → c10-moss-stays | ' +
    'c10-moss-fades | c10-moss-mourned → [c10-moss-light] → c10-close → [c10-bramble]. Chapter 11 begins after the last.',
  'c10-sable-watch': 'Optional, right after c10-open, only if Sable is bonded (she will be the bearer). Luna present. Clover’s grey blanket (c3-close) is on her back.',
  'c10-vigil':
    'Plays when lanternsAgain is met (all four lit). The fellowship scene; every Keeper holds a lantern. Three waves of cold ' +
    '(timed vigil gameplay can follow the same rhythm: wave 1 blows out the stream lantern; wave 2 shrinks the Long-Grass ' +
    'lantern to a blue bead; wave 3 is the song). Lantern Song lines as written, one song line per Line: Luna starts the ' +
    'chorus alone, then speaker chorus (everyone) takes it from the second line (UI may italicise; voice-over: one music ' +
    'cue). ' +
    'No grey-Nubbin count. Long-Grass lantern renders low and blue until dawn. Then [c10-vigil-wisp], then the timed vigil ' +
    'step, with c10-lull partway through it.',
  'c10-lull':
    'New. Plays partway through the timed vigil step (after the song, a quiet spell between waves), every route, before ' +
    'c10-falls. Comic warmth (Dusty as a seat, Pixel asleep on the beeping timer, waking once to tease her husband Byte about his lace (canon 38), Fern’s frozen biscuits) and Byte’s ' +
    'question the player answers: was it the lanterns or the people? Choices lull-lanterns | lull-us | lull-matter change ' +
    'Byte friendship only, no flags. Byte still cannot hear Moss (payoff c10-moss-stays).',
  'c10-vigil-wisp':
    'After c10-vigil, only if wisp = spared or sable (S2). Foreshadows the eucatastrophe: Wisp covets the “warm” stone.',
  'c10-falls':
    'After the vigil step, at the turn of the night. Sound: the falls ambience cuts to silence on line 1. Moss speaks only ' +
    'to you; you relay his order to hold the lanterns. You dig the tin out of the Long-Grass post. Then the bearer variant.',
  'c10-bearer-sable':
    'After c10-falls when Sable is bonded (sable.bond). She takes the shard in her mouth “as gently as an egg”. ' +
    'Sets stoneBearer = sable.',
  'c10-bearer-moss':
    'After c10-falls when Sable is NOT bonded (or gone). Moss carries it himself. Sets stoneBearer = moss.',
  'c10-ledge':
    'After the bearer scene. Location: the frozen falls and the Wellspring cave (warm, glittering, lit from below). ' +
    'Bearer-neutral text. Marina stays at the cave mouth with the rope. Party: you, the bearer, Moss (and, unseen, Wisp if ' +
    'spared).',
  'c10-edge':
    'The temptation. Bearer-neutral. Choice: unmake (keptStone = false) or keep (keptStone = true → Collector ending). ' +
    'Moss deliberately says nothing (“He said it all once, by the frozen post”: c7-stillness-3).',
  'c10-kept':
    'After c10-edge keep. Walk home with the stone; the Long-Grass lantern goes out at dawn; Ember recognises Corvin’s ' +
    'gesture; the gate opens by itself for you (echo of c2-corvin). No Long-Grass self-lighting, no Moss/Byte exchange. ' +
    'A rim of frost stays round the spring (the water itself never freezes; canon). ' +
    'Then c10-close. Art: from here the Keeper’s hand idles on the breast pocket.',
  'c10-safe-sable':
    'After c10-edge unmake, if stoneBearer = sable. Sable’s only spoken word in the game: “…safe.” (deliberately ambiguous).',
  'c10-safe-moss':
    'After c10-edge unmake, if stoneBearer = moss. The stone speaks to him in Cinder’s voice.',
  'c10-wisp':
    'After c10-safe-*, if wisp = spared or sable. The eucatastrophe: Wisp snatches the shard (“mine — warm — mine —”) and ' +
    'falls into the spring; the stone unmakes. Bearer-neutral. Sets stoneUnmadeBy = wisp. FX: gold bloom; falls ice goes ' +
    'honey-coloured.',
  'c10-moss-walks':
    'After c10-safe-sable, if wisp is NOT spared/sable (driven or unset). Moss takes the shard from Sable, forehead to ' +
    'forehead, and walks into the Wellspring. Sets stoneUnmadeBy = moss.',
  'c10-moss-walks-bearer':
    'After c10-safe-moss, if wisp is NOT spared/sable. Moss carries “her” home himself. Sets stoneUnmadeBy = moss.',
  'c10-bank-wisp':
    'After c10-wisp. You wait on the bank (rule three); at dawn Wisp is found asleep on the far bank, grey, not trembling. ' +
    'You carry him home (spawn Wisp in the Grove as a stray if the S2 recruit is available).',
  'c10-bank-moss-returned':
    'After c10-moss-walks*, if mossFaded is false (affection 40+ at ch10 start). Remembering him aloud; he climbs out at ' +
    'dawn, thinner: “You were very loud.” Sets mossReturned = true. Art: Moss alpha a little lower than before ch9.',
  'c10-bank-moss-gone':
    'After c10-moss-walks*, if mossFaded is true. Nothing comes up. Sets mossReturned = false. Remove Moss from the world ' +
    'after this scene (moss-sleeps if Sable is bonded).',
  'c10-dawn':
    'Unmade routes only (keptStone false), after the bank scene. From above the falls: the Long-Grass lantern lights itself ' +
    'at sunrise for the first time in twenty-two years (renderer: it burns steady from here on). The fourth was dark at ' +
    'first light, with Ember’s arms round it. Frost gone; dew. Sparks’s “I didn’t touch it!” pays off her sleep-talk in ' +
    'c4-out; the frozen-soup puck is a pure release beat.',
  'c10-moss-stays':
    'After c10-dawn when Moss is present and loved: mossFaded false (wisp route) or mossReturned true. Verbatim “The hands ' +
    'are slower. That’s better, actually.” and the shoelace exchange. Byte hears Moss for the first time (they all sat still ' +
    'long enough).',
  'c10-moss-fades':
    'After c10-dawn in the wisp route when mossFaded is true. Moss goes up the hill at dawn as Hazel comes down (they pass ' +
    'off-screen; Hazel says so in c11-moss-passed). Remove Moss after this scene; place a memorial flower on the hill by ' +
    'the flat stone where he always sat.',
  'c10-moss-mourned':
    'After c10-dawn when mossReturned = false. The Grove learns. Memorial flower appears on the hill by the flat stone ' +
    'where he always sat (not the long grass, which is the Long-Grass post).',
  'c10-moss-light':
    'After c10-moss-fades or c10-moss-mourned, only if Sable is bonded. The light drifts “down on the morning air”, ' +
    'from no named direction, so it fits both routes (hill or Wellspring). Moss’s pale ball settles beside Sable’s (art: a ' +
    'second, pale ball over Sable for the rest of the game; it is referenced by end-moss-sleeps).',
  'c10-close':
    'Chapter 10 closing, every route, after the Moss scene (or c10-kept). Hazel comes down the hill path with a lantern and ' +
    'a very thin grey Nubbin. Bearer- and Moss-neutral, and keep-neutral: “not one of them willing to” go home reads ' +
    'as gladness on the unmade routes and unease on the keep route. Spawn Hazel here (beginChapter(11) already does).',
  'c10-bramble':
    'After c10-close, only if s8Reunited (Fern has found Bramble in S8; S8 itself completes in ch11). The thin grey Nubbin is Bramble’s youngest; Fern recognises the ear, which folds over at the tip like Bramble’s ' +
    '(neither is torn; Wisp’s is). Fern stays as the Nubbin’s grandmother-by-Bramble; Hazel keeps carrying it. ' +
    'This is the one place Hazel says “Her mother runs the place… I gather you’ve met.” S8’s close has a dawn variant ' +
    '(s8-complete-dawn, side-stories-fun-2.ts) for runs where this scene played, so the two never repeat each other.',
  // ---------------------------------------------------------------- chapter 11
  'c11-open':
    'Chapter 11 opening, the morning after the Long Night, at the cottage bench. Verbatim “fourteen months” and “A Grove ' +
    'isn’t the Nubbins, love. It’s the people who show up when the lanterns are lit.” Hazel’s “Took two days. Worth it.” ' +
    'echoes the notebook. Byte’s “Condensation.” is a comic beat (Byte present, as all Keepers are). Hazel owns the ' +
    'letter’s “gone up the hill” (“optimistic about the timing”), and her line about Corvin is route-neutral (“He ' +
    'couldn’t. You did.”). Then, in order and if their conditions hold: c11-moss-here | c11-moss-kept | c11-moss-gone | ' +
    'c11-moss-passed, c11-sable, c11-cold-hands. Then the goal (talk to three Keepers). Opens S10. Chapter 11 spans a ' +
    'few days (bible); the late side stories fit inside them (see c11-close).',
  'c11-moss-here':
    'After c11-open on an unmade route when Moss is still in the world (mossReturned true, or the wisp route with ' +
    'mossFaded false). On the keep route play c11-moss-kept instead.',
  'c11-moss-kept':
    'NEW. After c11-open on the keep route (keptStone), in place of c11-moss-here. After c10-kept Moss sits on the hill ' +
    'with his back to the Grove and does not come down; he and Hazel only look at each other. Sets up c11-cold-hands.',
  'c11-moss-gone':
    'After c11-open when Moss went into the Wellspring and did not come back (c10-bank-moss-gone). Shares its tail ' +
    '(MOSS_GONE_TAIL) with c11-moss-passed.',
  'c11-moss-passed':
    'NEW. After c11-open when Moss went up the hill at dawn (c10-moss-fades), in place of c11-moss-gone. Pays off ' +
    'c10-moss-fades (“as if someone coming down has said his name”): Hazel passed him on the path, and he told her she ' +
    'was late. Shares MOSS_GONE_TAIL with c11-moss-gone.',
  'c11-sable': 'After the Moss add-on, only if Sable is bonded. Works for either first night (sableFirst slow or grab).',
  'c11-cold-hands': 'After the other add-ons, only if keptStone. Hazel recognises Corvin’s gesture in you.',
  'c11-close':
    'Chapter 11 closing, on the eve of chapter 12. Opens with “Days go by like that”: chapter 11 spans a few days, and the ' +
    'late side stories (S3’s Moot, S8’s close, S10, S18, S19, S20, S22) fit inside them. SIM: hold this scene until ' +
    'threeFriends is met AND S9 has had its chance (s9-ask has been seen, or S9 cannot run because keptStone, or S9 is ' +
    'still on step 1 or 2 at the dusk after threeFriends is met. Then c11-close plays that evening, c11-gate is skipped, ' +
    'and S9 jumps to its dawn gate scene before c12-open); it then plays that evening. ' +
    'LINE VARIANT. If s9-ask has been seen, insert after line 0 (“Days go by like that…”) the line ' +
    'N(‘Then comes the evening Corvin asks at the gate.’), so the days read as the ones before s9-ask, not after it. ' +
    'If s8Done (S8’s youngest has gone home to the ring), the line “The thin grey Nubbin wakes, ' +
    'looks at you, and goes back to sleep.” becomes “Hazel’s arm is empty now. She keeps it crooked anyway, out of ' +
    'habit.” ' +
    'It plays after s9-ask and s9-word. Ember-doesn’t-like-anyone exchange as in story.ts (split over two ' +
    'lines), and “you are not to be dramatic about it”. Sit by the pond. Bearer- and Moss-neutral. If S10 makes the pond ' +
    'sit interactive, its wish can replace the lines from “Sit with me. Here. By the pond.” to “…thinks better of it.” ' +
    'here. Then c11-gate (if s9-ask was seen), then S10’s s10-night (or -told), then chapter 12.',
  'c11-gate':
    'After c11-close, only on the night of s9-ask (the eve of chapter 12): play it if s9-ask has been seen. A return, not ' +
    'a discovery: Corvin’s first arrival is S9’s s9-dusk, and in s9-ask he said he would stand at the gate till first ' +
    'light. He tries the latch once, for form’s sake, and it sticks. Hazel’s stance is the same as in S9 (s9-yours): it ' +
    'is your gate now; she has done her part. Never plays if keptStone (S9 needs the stone unmade). Ends on a question ' +
    'the player answers: leave him (gate-leave), question Hazel (gate-cruel), or take him tea over the shut gate ' +
    '(gate-tea; the upside-down cup from c1-letter ends on the gatepost). No flags, no friendship, and the gate stays ' +
    'shut in every branch, so S9’s dawn gate scene decides corvinGate as before.',
  // ---------------------------------------------------------------- chapter 12
  'c12-open':
    'Chapter 12 opening, the morning after (S9’s gate scene, if any, plays before this). Everyone gathers; Hazel walks the ' +
    'four posts; the final choice. Choice ids/sets unchanged (keep → finalChoice keep; free → finalChoice free + letThemGo). ' +
    'Fern’s lantern buns finally come out (payoff of c4-close). Free: the gate comes off its hinges (art: gate leaning on the wall from here). Then: [c12-foot-told | ' +
    'c12-foot-secret] → s10-foot-* (S10’s who-walks choice, sets walk) → c12-walk-<walk>, or c12-walk-alone without S10 → c12-close → s10-letter (S10 complete, next morning) → ending.',
  'c12-foot-told': 'After c12-open, only if hazel = told. The Keepers walk her to the foot of the hill and stop.',
  'c12-foot-secret': 'After c12-open, only if hazel = secret. Nobody else notices her go.',
  'c12-walk-you': 'Hazel’s walk when walk = you. Shares the hilltop lines with c12-walk-alone.',
  'c12-walk-moss':
    'Hazel’s walk when walk = moss (S10 offers it while Moss is in the world: on an unmade route only if he came ' +
    'through the Long Night, and always on the keep route, faded or not). He stays at the top; the epilogue decides ' +
    'whether he comes down (end-epi-walk-moss on unmade routes, end-epi-walk-moss-stayed on the keep route).',
  'c12-walk-sable': 'Hazel’s walk when walk = sable (Sable bonded). Sable comes down alone and waits on your step.',
  'c12-walk-corvin':
    'Hazel’s walk when walk = corvin (corvinGate = family). Gate-neutral, so it works after “Open”. As in every walk, her ' +
    'lantern stays burning at the top, so c12-close needs no variant; Corvin fetches it down at first light and hangs it ' +
    'on the hook by the cottage door (end-epi-walk-corvin; S10’s letter finds it there).',
  'c12-walk-alone':
    'Hazel’s walk when S10 was not played (walk unset / no s10Done). You walk her up alone; no hazel told/secret add-on.',
  'c12-close':
    'Chapter 12 closing (the sim queues it after the walk). Dusk; the Keepers light all four; Hazel’s lantern burns on the ' +
    'hilltop all night and is out by morning; a new memorial flower near Briar’s. The lit cake plate is the last comic grace note. Then endingFor and end-<id>. S10’s ' +
    'second letter, if it has one, plays between this and the ending.',
  // ---------------------------------------------------------------- endings
  'end-hazels-grove':
    'ENDING ORDER (all eight): end-<id> → body variant if any → end-epi-wisp-* → end-epi-gate-* → end-epi-mill-* (S13, ' +
    'only if millLetter is set; kept but never given → -kept-ungiven) → end-epi-walk-* → end-epi-cinder-* (S19, only if ' +
    'cinder is set) → end-epi-told | end-epi-secret (only if S10 set hazel) → end-<id>-last. HAZEL’S GROVE: with ' +
    'letThemGo (final choice “Open”), queue end-hazels-grove-open IN PLACE OF end-hazels-grove (same title, first body ' +
    'line changed, the rest shared as HAZELS_GROVE_BODY), then -last as usual. The mill and cinder ' +
    'epilogue scenes live in side-stories-new-3.ts (SIDE_STORIES_NEW_3_VARIANTS). ' +
    'Wisp: spared+unmade → -spared; sable+unmade → -sable; spared/sable+keptStone → -kept; driven → -driven; unset → -none. ' +
    'Gate: corvinGate family/guest/shut → that; unset → -none. Walk: you/sable/corvin → that; moss → -moss-stayed if ' +
    'keptStone, else -moss; unset → -alone. ' +
    'Hazel’s Grove (rule: Sable bonded, Moss not faded, corvin = reconciled; either final choice): Moss is present; “Told ' +
    'you. Love is a method.” is in -last. Pixel’s trust meter now reads OBVIOUSLY (payoff of c7-close). “Sable makes a ' +
    'small sound” names her, so the line can’t be read as Pixel.',
  'end-hazels-grove-open':
    'NEW. Body variant of Hazel’s Grove when letThemGo (final choice “Open”): plays instead of end-hazels-grove, not ' +
    'after it. First body line: “There is no gate any more. Everyone who matters comes in anyway, and most of them still ' +
    'lift and push at the air where it was.” The rest is HAZELS_GROVE_BODY. wild-grove (freedByForce && letThemGo) is ' +
    'checked first, so a forced route with “Open” is still the Wild Grove (in practice forced and reconciled exclude each ' +
    'other anyway).',
  'end-hazels-grove-last': 'Final lines of Hazel’s Grove (verbatim “Told you. Love is a method.”).',
  'end-eternal-dawn':
    'Then end-eternal-dawn-moss if Moss is still in the world, else end-eternal-dawn-nomoss; then epilogues; then -last.',
  'end-eternal-dawn-moss': 'Body variant: Moss alive. Keeps his shoelace line from the old ending.',
  'end-eternal-dawn-nomoss': 'Body variant: Moss faded or did not return.',
  'end-eternal-dawn-last': 'Final lines of Eternal Dawn.',
  'end-shadow-keeper': 'Corvin-neutral (the gate epilogue says what became of him). Ash sits with Sable.',
  'end-shadow-keeper-last': 'Clover’s verbatim “The grey stays. You can only make it lighter.”',
  'end-moss-sleeps':
    'Sable bonded and Moss faded. Works whether he went into the water or up the hill. Sable carries his pale light ' +
    '(c10-moss-light).',
  'end-moss-sleeps-last': 'Luna: “Remember him louder.”',
  'end-wild-grove': 'No gate (finalChoice free). Echoes Hazel’s notebook line.',
  'end-wild-grove-last': 'Nova’s line, echoing her c8-open description of Hazel.',
  'end-empty-lantern': 'Sable gone. A fifth small lantern at the edge of the long grass on Lantern Night.',
  'end-empty-lantern-last': 'Hazel’s rule three, quoted from the first letter.',
  'end-collector':
    'Title only, then end-collector-kept if keptStone (takes precedence), else end-collector-sold; then epilogues; then ' +
    'end-collector-last.',
  'end-collector-sold':
    'Body variant: sold in ch2 and never bought anyone back (stone unmade). The pens opened in ch9 on both Collector ' +
    'routes (confront and force), so: you never went looking for the first one when the pens opened.',
  'end-collector-kept':
    'Body variant: kept the stone. Corvin, thawed or not, recognises it in you. Moss stayed on the hill after Hazel ' +
    'went up and never came down (matches c10-kept and c11-moss-kept).',
  'end-collector-last': 'Final line of the Collector (from the old ending): the gate no longer sticks.',
  'end-long-road': 'Sable present, not bonded. Pixel’s meter still says MAYBE, and you keep it that way (payoff of c7-close).',
  'end-long-road-last': 'Clover’s verbatim “Don’t you dare call that nothing.”',
  'end-epi-wisp-spared': 'wisp = spared and stoneUnmadeBy = wisp. He no longer trembles. He lives under the cottage step (the bathhouse is an optional build).',
  'end-epi-wisp-sable': 'wisp = sable and stoneUnmadeBy = wisp. Sable-neutral (works in the Empty Lantern too).',
  'end-epi-wisp-kept': 'wisp = spared or sable, and keptStone. The eucatastrophe denied.',
  'end-epi-wisp-driven': 'wisp = driven.',
  'end-epi-wisp-none': 'S2 never played (wisp unset).',
  'end-epi-gate-family': 'corvinGate = family. “Sundays by the pond.” Gate-neutral wording, so it works after “Open”.',
  'end-epi-gate-guest': 'corvinGate = guest. He knocks on the gatepost (there is always a gatepost).',
  'end-epi-gate-shut': 'corvinGate = shut.',
  'end-epi-gate-none': 'corvinGate unset (S9 not started, including every keptStone run): an empty chair by the pond.',
  'end-epi-walk-you': 'walk = you.',
  'end-epi-walk-moss': 'walk = moss on an unmade route (keptStone false; Moss came through the Long Night): he comes down in the spring.',
  'end-epi-walk-moss-stayed':
    'walk = moss on the keep route (keptStone true, so always the Collector ending, after end-collector-kept). S10 ' +
    'offers Moss on the keep route whether or not he has faded. At the top he turns to face the Grove for the first time ' +
    'since the Long Night; by spring there are two flowers. Avoids repeating end-collector-kept’s “never came down”.',
  'end-epi-walk-sable': 'walk = sable.',
  'end-epi-walk-corvin':
    'walk = corvin. He left her lantern burning at the top and fetched it down at first light; it hangs on the hook by ' +
    'the cottage door (S10’s letter finds it there).',
  'end-epi-walk-alone': 'walk unset (no S10).',
  'end-epi-told':
    'hazel = told (S10). They meet “on the day she went up” (chapter 11 spans several days, so not the morning after the ' +
    'Long Night). Fern’s lantern buns come out every year now (payoff of c4-close).',
  'end-epi-secret': 'hazel = secret (S10). The letter is S10’s second letter, under Fern’s stone from c1-letter.',
};
