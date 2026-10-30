/**
 * Story battles (recs FIGHT-82): six short scenes, each framing one OPTIONAL battle with a skip.
 * Every one is a play-fight: nobody is hurt, a tuckered-out Nubbin naps, and the far side yawns,
 * waves and goes home. The scene only frames the bout; the sim starts it from a flag.
 *
 * HOW A SCENE ENDS. Each scene closes on a two-way choice. The fight choice sets `bs-<x>-fight`
 * (the sim starts the battle on it); the other sets `bs-<x>-skip` (the story goes on as if the
 * bout never happened). The sim sets `bs-<x>-won` itself when the bout is won. Nothing in the
 * campaign reads any of these, so every ending stays reachable with every bout skipped.
 *
 *   x            where and when                                          bout
 *   exhibition   chapter 5, the Circuit's infield, before c5-race        3v3 turn-based vs Sparks
 *   rumble       chapter 8, the Hollow, before the notebook (c8-close)   4v4 tactics, `reach` the camp
 *   fort         S20 rematch: after s20-complete, once chapter 12 opens  4v4 tactics, `gather` 5 plums
 *   corvin       chapter 9, Corvin's back wall, before c9-open           tactics `protectPlot`, or talk
 *   logged       Logged In (SL2) chapter 8, the Night Grove server       5v5 party bout
 *   remembering  post-game, after any ending where the stone was unmade   6-unit tactics `calmBoss`
 *                and Moss came back (not moss-sleeps, not collector)
 *
 * CHAPTERS 9–11. Only `bs-corvin` sits inside them, and only by the player's choice. S20 itself is
 * a chapter 11 side story, so its rematch waits for chapter 12 (the snow is still lying).
 *
 * CORVIN'S CHOICE. `bs-corvin-defended` (true) or `bs-corvin-talked` (true). Each has a payoff
 * scene in BATTLES_STORY_VARIANTS, played on the first Grove morning of chapter 12 (several quests
 * after chapter 9): `bs-corvin-kale-defended` (seed on the gatepost) and `bs-corvin-kale-talked`
 * (a note under the door). Both are route-proof: by chapter 12 the shard is home in every route.
 *
 * SPEAKERS. Grove scenes use the campaign speakers plus S20's Wren, Tilly and Gordon. The Logged
 * In scene uses that storyline's own speakers (l-warden, l-juno), so it is exported apart, as
 * BATTLES_STORY_LOGGED, for the storyline to play; the Grove's speaker check never sees it.
 *
 * AUDIENCE. 'main' for all of them (the Learning Grove has Play-fight Day instead).
 */
import type { Choice, Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };
/** A punchline (STYLE.md, joke density). */
const gag = (l: Line): Line => ({ ...l, gag: true });

const N = say('narrator');
const SPARKS = say('sparks');
const BYTE = say('byte');
const NOVA = say('nova');
const MARINA = say('marina');
const EMBER = say('ember');
const CORVIN = say('corvin');
const MOSS = say('moss');
const PX = say('pixel');
const WR = say('wren');
const TI = say('tilly');
const GO = say('gordon');
const WARDEN = say('l-warden');
const JUNO = say('l-juno');

/** The fight / skip pair every story battle ends on. */
const pair = (x: string, fight: Omit<Choice, 'id'>, skip: Omit<Choice, 'id'>): Choice[] => [
  { id: 'fight', ...fight, set: { [`bs-${x}-fight`]: true, ...fight.set } },
  { id: 'skip', ...skip, set: { [`bs-${x}-skip`]: true, ...skip.set } },
];

export const BATTLES_STORY_VARIANTS: Scene[] = [
  // ------------------------------------------------------------ a. chapter 5: Circuit Exhibition
  {
    id: 'bs-exhibition',
    lines: [
      N('Before the race, the Circuit holds an exhibition bout on the infield. Nobody wins anything. Sparks has entered anyway.'),
      SPARKS('Three on three! A warm-up! Loosens the legs, wakes the brain, scares the frost off the rails!', 'happy'),
      gag(BYTE('It does not scare the frost off the rails. I have measured the rails.', 'think')),
      gag(SPARKS('Then it scares Byte. Even better.')),
      gag(N('Her three runners bounce on the spot. One bounces sideways into the next, and both pretend it was planned.')),
      SPARKS('Play-fight only. Tired ones nap. Winner buys the buns. Loser also buys the buns. I just like buns.'),
      N('Your Nubbin looks at the white rails, then at Sparks, and decides she is the warmer of the two.'),
      BYTE('I’ll time it. For no reason. The stopwatches are out anyway.'),
    ],
    choices: pair(
      'exhibition',
      {
        label: 'Three on three. Warm those legs up.',
        then: [SPARKS('YES! Lanes, everyone! Wrong lane! Other wrong lane! Close enough!', 'happy')],
      },
      {
        label: 'Save their legs for the race.',
        then: [
          SPARKS('Sensible. Hate it. Respect it.', 'think'),
          gag(N('She holds the exhibition against Byte instead. He loses, mostly by stopping to time it.')),
        ],
      },
    ),
  },
  // ------------------------------------------------------------ b. chapter 8: The Rumble Room
  {
    id: 'bs-rumble',
    lines: [
      N('Past the falls, the Hollow path drops into a round room of roots. On the far side is a gap, and firefly light beyond it.'),
      gag(NOVA('Hazel’s camp is through there. I’d know that tarpaulin anywhere. It’s held up by string and opinions.', 'soft')),
      N('Between you and the gap, four young greys tumble about in the roots. They are playing at guarding it.'),
      gag(N('They are grey, but they are not still. One pounces on a beetle and misses by a long way.')),
      MARINA('They aren’t cross. They’re bored. Nobody’s played with them since she went in there.', 'think'),
      NOVA('A rumble, then. Get one of yours through the gap to the camp. Nobody chases anybody off.'),
      MARINA('Careful, not brave. Same as the ledge.'),
      gag(N('The greys see your four and freeze. Then the smallest wiggles its bottom, which is the oldest invitation there is.')),
    ],
    choices: pair(
      'rumble',
      {
        label: 'Four on four. Play, and make for the gap.',
        then: [NOVA('Spread out. The roots make corners, and corners are where the fun is.', 'happy')],
      },
      {
        label: 'Sit on a root and wait for them to wander off.',
        then: [
          N('You sit. After a while the greys forget to guard anything, and drift off after a moth.'),
          MARINA('Hazel’s way. Takes longer. Works.', 'soft'),
        ],
      },
    ),
  },
  // ------------------------------------------------------------ c. S20 rematch: the snow fort
  {
    id: 'bs-fort',
    lines: [
      N('The snow on the Common is still deep. Somebody has rebuilt both forts overnight, badly.'),
      WR('Commander! Commander! It’s a rematch, commander! With Nubbins this time!', 'happy'),
      TI('Four of yours, four of mine. Pixel has hidden five frozen plums in the drifts. First fort to fetch them home wins.', 'happy'),
      PX('Ruling: this is a gathering round. Snowballs are allowed. Snowballs at the referee are not.'),
      gag(PX('Ruling: Gordon is not a plum.')),
      gag(GO('I’m all right!', 'happy')),
      gag(WR('What’s the battle cry, commander? Same as last time? I’ve been practising it in the bath.')),
      N('Your four Nubbins stand in a row in the snow, steaming slightly, ready for anything that is mostly plums.'),
    ],
    choices: pair(
      'fort',
      {
        label: 'Fetch those plums home.',
        then: [WR('Yes, commander! Gathering, commander! Very fast, commander!', 'happy')],
      },
      {
        label: 'Call it a draw and have cocoa.',
        then: [TI('A draw? …Fine. Cocoa is a kind of winning.', 'think'), gag(PX('Ruling: cocoa.'))],
      },
    ),
  },
  // ------------------------------------------------------------ d. chapter 9: Corvin's garden (the choice)
  {
    id: 'bs-corvin',
    lines: [
      N('Ember wants to see the garden before she has to see him. You come round by the back wall first.'),
      N('Outside the railings is one square bed the frost has not taken: winter kale, dark green and ragged.'),
      N('It is the only green thing for half a mile.'),
      EMBER('That’s been there as long as I can remember. He hates it.', 'think'),
      CORVIN('I don’t hate it. I clear it. Every dusk.'),
      N('He is on the other side of the railings, coat buttoned, left hand flat over his breast pocket.'),
      CORVIN('It comes back every time. Nothing I keep in here comes back to anything.', 'think'),
      CORVIN('Mine will clear it now. They won’t hurt anything. They never do anything I haven’t asked.'),
      N('A line of grey runners files out of the side gate towards the bed, perfectly in step.'),
      EMBER('Stop them, then. Or don’t. I don’t know which is worse.', 'angry'),
    ],
    choices: [
      {
        id: 'defend',
        label: 'Stand your Nubbins round the bed and hold it till dark.',
        set: { 'bs-corvin-defended': true, 'bs-corvin-fight': true },
        then: [
          CORVIN('A play-fight. Of course. She would have done the same.', 'sad'),
          N('Your Nubbins plant their feet among the kale. The grey line stops, and waits to be told what to do about it.'),
        ],
      },
      {
        id: 'talk',
        label: 'Lean on the wall and ask him who planted it.',
        set: { 'bs-corvin-talked': true, 'bs-corvin-skip': true },
        then: [
          CORVIN('Nobody. It was here when I came. I assumed it was a mistake.', 'think'),
          N('He lifts one hand. The grey runners stop mid-step and stand there in the dusk.'),
          CORVIN('Come round to the front. We’ll do this properly.'),
          gag(N('He goes in to meet you at his own gate, as if none of this counted.')),
        ],
      },
    ],
  },
  // ------------------------------------------------------------ d. payoffs, first Grove morning of chapter 12
  {
    id: 'bs-corvin-kale-defended',
    lines: [
      N('A paper parcel sits on your gatepost, tied with very good string.'),
      N('Inside is a twist of kale seed, small and dark, and a card in very neat handwriting.'),
      CORVIN('“It came back. It always does. I have stopped clearing it. C.V.”', 'soft'),
      gag(N('You sow it by the long grass. By spring the bed is ragged, dark green and entirely unrepentant.')),
    ],
  },
  {
    id: 'bs-corvin-kale-talked',
    lines: [
      N('A note comes under the door. The paper is very good. The envelope is not cold.'),
      CORVIN('“You asked who planted the kale. Nobody did, as far as I can find. The variety is Hungry Gap.”'),
      CORVIN('“It feeds people in the lean weeks of spring, when nothing else will. I walked past it for twenty-two years.”', 'soft'),
      CORVIN('“Nobody had asked me a question in a long time that was not about a price. C.V.”'),
      N('You put the note in the drawer, under Hazel’s letter, and this time you leave it there.'),
    ],
  },
  // ------------------------------------------------------------ f. post-game: Moss's Remembering
  {
    id: 'bs-remembering',
    lines: [
      N('A spring evening, long after. Moss is on his flat stone on the hill, and he has been waiting for you.'),
      MOSS('There is one I never told you of. It is not in the Tale of the Four. It is older than the tale’s ending.', 'soft'),
      MOSS('In the White Year, when the cold came down, one of the old Shadows went into the Hollow and lay down under the roots.'),
      MOSS('The stone is unmade. The cold has gone out of the valley. Nobody told that one.', 'sad'),
      N('Down past the falls, where the roots meet the rock, frost lies on a single patch of ground. It does not melt.'),
      MOSS('It is not wicked. It has only been cold for a very long time, and has forgotten there is anything else.'),
      MOSS('You cannot warm a thing by beating it. You stand near, and you stay, until it remembers.', 'think'),
      MOSS('Bring six. The gentle ones as well as the strong. It will want to be sure.'),
      N('He gets up slowly, one hand on the stone, and does not ask whether you are coming.'),
    ],
    choices: pair(
      'remembering',
      {
        label: 'Go down with him. Bring six.',
        then: [MOSS('Good. Slow hands, then.', 'soft')],
      },
      {
        label: 'Not tonight. Sit with him here instead.',
        then: [
          N('You sit. Moss says nothing more about it, and the evening goes blue around you both.'),
          MOSS('It has waited a long while. It can wait for a kinder night.', 'soft'),
        ],
      },
    ),
  },
];

/** e. Logged In (SL2), chapter 8 on the Night Grove server: played by the storyline, with its own speakers. */
export const BATTLES_STORY_LOGGED: Scene[] = [
  {
    id: 'bs-logged',
    lines: [
      N('The Night Grove. The blue grass glows. The board hangs in the dark with your word still unposted.'),
      gag(WARDEN('A final exhibition is available at this rank: five on five. It is optional. Warden would like that noted.')),
      JUNO('My two and your three, against the company’s five. One last bout before we go home.', 'think'),
      N('Her partners stand beside yours: a round one with a chipped horn, and a thin one that hums when it is nervous.'),
      JUNO('If we lose, we lose together. Nobody stays behind for a bout. That’s my one rule.', 'soft'),
      N('Across the meadow, the company’s five step out of the blue grass without a chime.'),
      gag(WARDEN('Warden reminds players that tuckered partners nap and wake in the lobby. Warden is pleased to say so.')),
    ],
    choices: pair(
      'logged',
      {
        label: 'Five on five. Together.',
        then: [JUNO('Together. Rally on my call.', 'happy')],
      },
      {
        label: 'Post the word now. No more bouts.',
        then: [JUNO('Fine. Good. My two were sleepy anyway.', 'soft')],
      },
    ),
  },
];

/** Every flag these scenes set or the sim sets after their bouts. */
export const BATTLES_STORY_FLAGS: string[] = [
  'bs-exhibition-fight', // true: start the ch5 3v3 against Sparks now
  'bs-exhibition-skip', // true: skipped
  'bs-exhibition-won', // true: set by the sim when the bout is won
  'bs-rumble-fight', // true: start the ch8 4v4 tactics rumble (reach the camp)
  'bs-rumble-skip',
  'bs-rumble-won',
  'bs-fort-fight', // true: start the S20 rematch, 4v4 tactics gather (5 plums)
  'bs-fort-skip',
  'bs-fort-won',
  'bs-corvin-fight', // true: start the ch9 protectPlot tactics bout (set with bs-corvin-defended)
  'bs-corvin-skip', // true: no bout (set with bs-corvin-talked)
  'bs-corvin-won',
  'bs-corvin-defended', // true: the player stood on the kale; payoff bs-corvin-kale-defended in ch12
  'bs-corvin-talked', // true: the player asked who planted it; payoff bs-corvin-kale-talked in ch12
  'bs-logged-fight', // true: start the Logged In 5v5 party bout on the Night Grove
  'bs-logged-skip',
  'bs-logged-won',
  'bs-remembering-fight', // true: start the post-game 6-unit calmBoss against the old cold Shadow
  'bs-remembering-skip',
  'bs-remembering-won',
];

export const BATTLES_STORY_CHECKS: string[] = [
  'battle:win:bs-exhibition',
  'battle:win:bs-rumble',
  'battle:win:bs-fort',
  'battle:win:bs-corvin',
  'battle:win:bs-logged',
  'battle:win:bs-remembering',
];
