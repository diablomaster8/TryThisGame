/**
 * Storyline SL2, "Logged In" (plan G12): the Keeper is a child inside "Grove Online", a
 * game that locks everyone in. Three partners in a party, turn-based party bouts
 * (sim/party-bout.ts), two mirrored servers (the Day Grove and the Night Grove, which are
 * the Sun and Moon recolours), and a mystery about who runs the game. The company and
 * the missing sibling are a teen-rated thread, played only with the Mature content
 * setting at 13+ or above (`mature:teen` beats); the main line stays `main`.
 *
 * AUDIENCE. 'main', with `teen` beats behind the setting.
 *
 * SOURCE. Digimon World 3 (2002): the locked-in MMO frame, the party of three, the
 * mirrored servers. Mechanics and frame only; every name and line is original.
 *
 * SPEAKERS. Warden, the game's moderator voice; Juno, eleven, another locked-in player;
 * Root, the founder's recorded voice.
 *
 * BEATS. Between each chapter's opening and its goal: Warden's tips as the eggs hatch,
 * Juno's talks on the story clock (`days:` from the chapter's start), the bout counts
 * between the ranks, a lost partner, and the teen thread. Each plays once, in order,
 * only while its chapter is open.
 *
 * FLAGS. `party` (three ids, comma-joined), `area` (day | night), `l-told` (sister |
 * quiet: what you told Juno about who you miss), `l-sister` (the sibling thread was
 * read), `l-paid` (teen: the deleted post), `l-root` (expose | spare), `l-juno`
 * (stayed | left: read by every ending's body), `l-end` (the ending, fixed by the rule when
 * l-c8-close is done).
 */
import type { Line, LineGesture, Mood, Scene } from '../config/story';
import type { Speaker, Storyline, StorylineChapter } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood, gesture?: LineGesture): Line => ({
    who,
    text,
    ...(mood ? { mood } : {}),
    ...(gesture ? { gesture } : {}),
  });

const N = say('narrator');
const Y = say('you');
const WARDEN = say('l-warden');
const JUNO = say('l-juno');
const ROOT = say('l-root');

export const LOGGED_SPEAKERS: Speaker[] = [
  { id: 'l-warden', name: 'Warden', kind: 'other' },
  { id: 'l-juno', name: 'Juno', kind: 'other' },
  { id: 'l-root', name: 'Root', kind: 'other' },
];

const ch = (
  n: number,
  title: string,
  opening: Scene,
  goal: string,
  goalText: string,
  hint: string,
  closing: Scene,
  beats?: StorylineChapter['beats'],
): StorylineChapter => ({
  n,
  title,
  opening,
  goal,
  goalText,
  hint,
  closing,
  ...(beats ? { beats } : {}),
});

export const LOGGED_CHAPTERS: StorylineChapter[] = [
  ch(
    1,
    'Log In',
    {
      id: 'l-c1-open',
      lines: [
        N(
          'The visor is too big and smells of someone else’s hair. You pull it down. The bedroom goes. A meadow comes.',
        ),
        WARDEN(
          'Welcome to Grove Online. Session one. Three starter eggs have been placed near you. Please enjoy your stay.',
        ),
        N(
          'Three eggs on the grass, each with a little green tick floating over it. The grass is too green. Everything is slightly too much.',
        ),
      ],
    },
    'stat:hatched:>=3',
    'Hatch your three starter eggs.',
    'Hold and shake each one. The party is all three.',
    {
      id: 'l-c1-close',
      lines: [
        N('Three of them, blinking at the too-green grass and then at you, deciding something.'),
        WARDEN('Party formed. Tutorial bout available at the Day Grove lobby.'),
      ],
    },
    [
      {
        when: 'stat:hatched:>=1',
        scene: {
          id: 'l-c1-first',
          lines: [
            N(
              'The first one hatches with a small polite chime, as if the meadow were pleased with itself.',
            ),
            WARDEN(
              'Starter hatched. Two remaining. Tip: hold the egg and shake it. Tip: not like that.',
            ),
            N('The hatchling looks at the green tick over its own head and tries to eat it.'),
          ],
        },
      },
      {
        when: 'stat:hatched:>=2',
        scene: {
          id: 'l-c1-second',
          lines: [
            N(
              'The second looks at the first for a long moment, the way you look at someone who has your face.',
            ),
            WARDEN(
              'Starter hatched. One remaining. Tip: partners who hatch together bout together.',
            ),
            N(
              'Somewhere off in the meadow, far too faint, someone is calling a name that is not yours.',
            ),
          ],
        },
      },
    ],
  ),
  ch(
    2,
    'The Lobby',
    {
      id: 'l-c2-open',
      lines: [
        N(
          'The Day Grove lobby: a meadow with a scoreboard in it. Other players stand about, slightly too still, the way people do when they are somewhere else.',
        ),
        JUNO('You’re new. I can tell, you keep looking at your hands.'),
        JUNO(
          'Bouts are over there. Three on three. It’s turns, not timing. Guard when they look at you funny.',
        ),
      ],
    },
    'count:partyBout:>=1',
    'Win your first party bout.',
    'The journal’s Fight a bout button. Strike the weakest foe; guard when a foe is winding up; rally when two of yours are low.',
    {
      id: 'l-c2-close',
      lines: [
        N('The foes blink out one by one, politely, like lights in a house going to bed.'),
        JUNO(
          'Not bad. I’m Juno. I’ve been in for nine days. Don’t ask me what day it is out there, nobody knows.',
        ),
      ],
    },
    [
      {
        when: 'days:>=1',
        scene: {
          id: 'l-c2-still',
          lines: [
            N(
              'The other players do not move much. One has stood at the scoreboard since you arrived, reading the same line.',
            ),
            JUNO(
              'Don’t stare. Some of them are asleep out there. The game keeps the shape standing. It’s polite like that.',
            ),
            JUNO(
              'I poked one once. It said “please enjoy your stay”. In her voice. I stopped poking.',
            ),
          ],
        },
      },
      {
        when: 'stat:feeds:>=1',
        scene: {
          id: 'l-c2-fruit',
          lines: [
            N(
              'The fruit tastes of the word “fruit”. Your partner eats it as if it tasted of fruit.',
            ),
            WARDEN(
              'Tip: a fed partner strikes true. Tip: the trees never run out. Tip: please do not test this.',
            ),
          ],
        },
      },
    ],
  ),
  ch(
    3,
    'No Log Out',
    {
      id: 'l-c3-open',
      lines: [
        N(
          'You reach up for the visor. There is no visor. There is only the meadow, and your hand on your own hair.',
        ),
        WARDEN('Log out is temporarily unavailable. Please continue to enjoy your stay.'),
        JUNO('Yeah. That. It said that on day one. It still says it.', 'sad', 'nod'),
        JUNO(
          'Bouts rank you. Rank opens doors. Nobody’s found the door out yet, but nobody’s been high enough to look.',
        ),
      ],
    },
    'count:partyBout:>=3',
    'Win three bouts to rank up.',
    'Keep the party fed between bouts: a hungry partner strikes soft.',
    {
      id: 'l-c3-close',
      lines: [
        WARDEN('Rank two. The Night Grove server is now open to you.'),
        JUNO(
          'Night Grove. Same meadow, dark. Same bouts, harder. Same everything, but at night the message board shows older posts.',
        ),
      ],
    },
    [
      {
        when: 'count:partyBout:>=2',
        scene: {
          id: 'l-c3-second',
          lines: [
            JUNO(
              'Two. Your middle one guards before it’s told. That’s rare. Mine just hit things and apologised.',
            ),
            N('She says “mine” and then does not say anything else for a while.'),
          ],
        },
      },
      {
        when: 'days:>=2',
        scene: {
          id: 'l-c3-meals',
          lines: [
            JUNO(
              'Day ten, for me. I count by meals. The game feeds you if you forget. It tastes of the word “food”.',
            ),
            JUNO(
              'I’ve got a mum and a cat out there. The cat will be fine. The cat is always fine.',
            ),
            JUNO('Who’ve you got?'),
          ],
          choices: [
            {
              id: 'sister',
              label: 'A sister. She works on games. Worked.',
              set: { 'l-told': 'sister' },
              then: [
                JUNO('Worked. Right.', 'think'),
                N('She looks at the board by the gate, and then away from it, quickly.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Nobody you want to talk about in here.',
              set: { 'l-told': 'quiet' },
              then: [JUNO('Fair. In here’s not the place. Nothing in here is the place.')],
            },
          ],
        },
      },
    ],
  ),
  ch(
    4,
    'Night Grove',
    {
      id: 'l-c4-open',
      lines: [
        N(
          'The Night Grove is the meadow with the lights off and the scoreboard still glowing. The grass is too blue now. The stillness is the same.',
        ),
        JUNO('Fight here. Then come and look at the board with me. I want a witness.'),
      ],
    },
    'area:night&count:partyBout:>=5',
    'Cross to the Night Grove and win two bouts there.',
    'Where To: Night Grove. Bouts count wherever you fight; the night ones hit harder.',
    {
      id: 'l-c4-close',
      lines: [
        N(
          'Two bouts in the dark. Your three stand closer together afterwards, without being asked.',
        ),
        WARDEN('Rank three. Message board history unlocked.'),
      ],
    },
    [
      {
        when: 'area:night',
        scene: {
          id: 'l-c4-night',
          lines: [
            N(
              'Night, and the board by the gate has posts on it that were not there by day. Old ones. One is signed with a name you know.',
            ),
            N(
              'Your three have found out the green ticks glow blue at night. The smallest licks its own and glows faintly for an hour, delighted.',
            ),
          ],
        },
      },
      {
        when: 'area:night&count:partyBout:>=4',
        scene: {
          id: 'l-c4-dark-bout',
          lines: [
            N(
              'A night bout. The foes come out of the blue grass with no chime at all, and your three stand closer before the first turn.',
            ),
            JUNO(
              'Told you. Harder. Also quieter. I don’t know which I mind more.',
              undefined,
              'shrug',
            ),
          ],
        },
      },
      {
        when: 'days:>=2',
        scene: {
          id: 'l-c4-sleepers',
          lines: [
            N(
              'By night the still players are harder to see, and easier to hear. Some of them breathe.',
            ),
            JUNO('They’re not dead. I checked. I check every night. Somebody should.', 'soft'),
          ],
        },
      },
    ],
  ),
  ch(
    5,
    'The Message Board',
    {
      id: 'l-c5-open',
      lines: [
        N(
          'The board at night: hundreds of posts, most of them “anyone found the exit?”, a few of them older than the game is supposed to be.',
        ),
        JUNO('There. Second from the bottom. Read it.'),
        Y('You read it. It is from your sister. It is dated before you had a visor.'),
      ],
    },
    'act:read-the-board',
    'Read the whole thread on the board.',
    'The journal’s Do it. Night only.',
    {
      id: 'l-c5-close',
      lines: [
        N(
          '“Testing build four. If anyone reads this, the exit is where the game started. Not the lobby. The root.”',
        ),
        JUNO('Your sister was a tester. She was in here before any of us.', 'shock'),
        JUNO('Testers work for the company that built this. The ones who say sorry as Tips.'),
        Y('You knew she tested games. You did not know which.'),
      ],
      set: { 'l-sister': true },
    },
    [
      {
        when: 'flag:l-told:sister',
        scene: {
          id: 'l-c5-told',
          lines: [
            JUNO(
              'You said a sister, who worked on games. I saw the name two nights ago. I didn’t want to say till you’d seen it.',
            ),
            JUNO('I’d have wanted to find it myself. Was that right?'),
            Y('It was right.'),
          ],
        },
      },
      {
        when: 'flag:l-told:quiet',
        scene: {
          id: 'l-c5-quiet',
          lines: [
            JUNO(
              'You never said who you were missing. I think I know now. I’m sorry. I’ll stand here while you read.',
              undefined,
              'chest',
            ),
            N(
              'She stands there. The board hums faintly, like something kept switched on too long.',
            ),
          ],
        },
      },
      {
        when: 'mature:teen&act:read-the-board',
        scene: {
          id: 'l-c5-thread',
          lines: [
            N(
              'Further down, a post she deleted and the board kept. The company knew the lock-in was possible. They shipped anyway, and paid the testers to stay quiet.',
            ),
            JUNO(
              'They paid her. And then they lost her in here and said nothing to anyone.',
              'angry',
            ),
            N('You read it twice. The second time is worse.'),
          ],
          set: { 'l-paid': true },
        },
      },
    ],
  ),
  ch(
    6,
    'Mirror Match',
    {
      id: 'l-c6-open',
      lines: [
        WARDEN(
          'Rank four requires a mirror match: one bout on each server within a single session.',
        ),
        JUNO(
          'Day, then night, then the root door opens. That’s what the old posts say. Nobody’s been rank four.',
        ),
      ],
    },
    'count:partyBout:>=8',
    'Win three more bouts, on both servers.',
    'Where To switches the server. Three wins from here.',
    {
      id: 'l-c6-close',
      lines: [
        WARDEN(
          'Rank four. A door has opened in the lobby. Warden is not permitted to describe it. Warden can confirm it is a door.',
        ),
        N(
          'The door is a plain door in the meadow, with a plain handle, and nothing on the other side you can see.',
        ),
      ],
    },
    [
      {
        when: 'count:departed:>=1',
        scene: {
          id: 'l-c6-lost',
          lines: [
            N(
              'One of the three does not get up after the bout. The game offers a fade, polite, like a light going to bed, and then a flower on the too-green grass.',
            ),
            JUNO(
              'It does that. It did it to mine on day six. I didn’t tell you because you’d have looked at yours differently.',
              'sad',
            ),
            N(
              'Two stand either side of the flower for a while. Then they stand either side of you.',
            ),
          ],
        },
      },
      {
        when: 'count:partyBout:>=6',
        scene: {
          id: 'l-c6-day-win',
          lines: [
            N(
              'A win by day. The scoreboard flickers and puts your name one line higher than it has ever been.',
            ),
            WARDEN('Mirror progress: one of two. Tip: the other server is the other server.'),
          ],
        },
      },
      {
        when: 'count:partyBout:>=7',
        scene: {
          id: 'l-c6-night-win',
          lines: [
            N(
              'A win by night, with no chime. The blue grass lies down flat where the foes stood and does not get up.',
            ),
            JUNO(
              'One more. Anywhere. I’ll be at the lobby door. I want to see it open from the front.',
            ),
            JUNO('The cat would’ve done that in two. The cat is always fine.', 'happy'),
          ],
        },
      },
      {
        when: 'mature:teen&flag:l-paid',
        scene: {
          id: 'l-c6-wage',
          lines: [
            JUNO(
              'If they paid her to keep quiet, they’re paying someone now to keep this running. Somebody is on a wage while we’re in here.',
            ),
            Y('Somebody is on a wage.'),
            JUNO('Rank four. Then the root. Then we find out whose.', 'angry'),
            WARDEN('Warden is also on a wage. The wage is nothing. Warden would like that noted.'),
          ],
        },
      },
    ],
  ),
  ch(
    7,
    'The Root Node',
    {
      id: 'l-c7-open',
      lines: [
        N(
          'Through the door: a white room with one chair. You sit, and a recording starts in your sister’s voice, a year more tired.',
        ),
        ROOT(
          'Hello, you. If you are hearing this, the lock has engaged and I am not there to open it. I am sorry. That is not a figure of speech.',
        ),
        ROOT(
          'The exit is a word. Say it on the board and every session ends. Everyone wakes. Including the ones the company would rather you did not ask about.',
        ),
        JUNO('Say it. Say it now.'),
        N(
          'There is a second recording. It is the company, offering a different word: a quiet exit, one at a time, no questions, no sister.',
        ),
      ],
      choices: [
        {
          id: 'expose',
          label: 'Say Root’s word. Everyone wakes, and everyone knows.',
          set: { 'l-root': 'expose' },
          then: [JUNO('Good.', 'soft')],
        },
        {
          id: 'spare',
          label: 'Take the quiet exit.',
          set: { 'l-root': 'spare' },
          then: [JUNO('You’d leave them in here. You’d leave her.', 'angry')],
        },
      ],
    },
    'flag:l-root',
    'Choose a word.',
    'The choice is the goal.',
    {
      id: 'l-c7-close',
      lines: [
        N(
          'The white room folds up like paper. You are in the lobby with a word in your mouth and three partners looking up at you.',
        ),
        WARDEN(
          'A final bout is required to post on the board at this rank. Warden apologises for the design.',
        ),
      ],
    },
  ),
  ch(
    8,
    'Log Out',
    {
      id: 'l-c8-open',
      lines: [
        N(
          'The last bout. The foes are the company’s, and they are not polite, and they do not blink out like lights going to bed.',
        ),
        JUNO('Whatever you say after, I’m posting next to you. Witness.', undefined, 'shrug'),
      ],
    },
    'count:partyBout:>=10',
    'Win the final bouts and post the word.',
    'Two more wins. Rally when it turns.',
    {
      id: 'l-c8-close',
      lines: [
        N(
          'You post the word. The board takes it. The meadow holds its breath, which it has never done before.',
        ),
      ],
      choices: [
        { id: 'stayed', label: 'Ask Juno to come find you outside.', set: { 'l-juno': 'stayed' } },
        { id: 'left', label: 'Say goodbye properly.', set: { 'l-juno': 'left' } },
      ],
    },
    [
      {
        when: 'flag:l-root:expose',
        scene: {
          id: 'l-c8-loud',
          lines: [
            JUNO(
              'Everyone wakes. Say it like that, in your head, every turn. It helps. It helped me on day six.',
            ),
            N(
              'Your three line up without being told. The middle one guards first, as it always has.',
            ),
          ],
        },
      },
      {
        when: 'flag:l-root:spare',
        scene: {
          id: 'l-c8-quiet',
          lines: [
            JUNO('I said I’d post next to you. I will. I don’t have to like the word.'),
            N(
              'She does not look at you. She looks at the still players, and counts them, the way she does every night.',
            ),
          ],
        },
      },
      {
        when: 'count:partyBout:>=9',
        scene: {
          id: 'l-c8-nine',
          lines: [
            N(
              'One down. The company’s foes do not regroup so much as reload, and come back with the same faces.',
            ),
            JUNO('Rally. Now. Don’t wait for two of them to be low. These ones don’t let you get low.'),
            WARDEN(
              'Warden is not permitted to offer a tip at this rank. Warden suggests you guard.',
            ),
          ],
        },
      },
    ],
  ),
];

export const LOGGED_ENDINGS: Record<string, { title: string; how: string }> = {
  'everyone-wakes': {
    title: 'Everyone Wakes',
    how: 'Say Root’s word at the root node, and keep all three partners through the last bout.',
  },
  'quiet-exit': {
    title: 'The Quiet Exit',
    how: 'Take the company’s word.',
  },
  'one-short': {
    title: 'One Short',
    how: 'Say Root’s word, having lost a partner along the way.',
  },
};

/*
 * Each ending plays in two parts. The rule (sim/storyline-rules-logged.ts) queues the body
 * after l-c8-close, as `l-end-<ending>-<l-juno>`, so the last choice is answered before the
 * title card; then `end-logged-<ending>` plays the card itself.
 */
const WAKES_BODY: Line[] = [
  N(
    'Every scoreboard in the meadow goes white. Then the meadow goes. Then a ceiling, a bedroom, a visor in your hands that smells of your own hair.',
  ),
  N(
    'Down the hall, a door opens that has been shut for a year. Someone says your name as if they have been practising it.',
  ),
  N(
    'In the morning it is on every news site. In the evening three small shapes are asleep on your bed, which should not be possible, and is.',
  ),
];

const QUIET_BODY: Line[] = [
  N(
    'A door, one at a time, no questions. You wake in your bedroom with the visor on the floor and nobody saying your name.',
  ),
  N('The game is still up. Juno’s session is still in it. Down the hall, a shut door stays shut.'),
  N(
    'Three small shapes on the bed, looking at you the way they looked at the too-green grass: deciding something.',
  ),
];

const SHORT_BODY: Line[] = [
  N('Every scoreboard goes white. You wake. Down the hall a door opens, and someone says your name.'),
  N(
    'Two small shapes on the bed. The third was the one who guarded when they looked at you funny, and did not get up.',
  ),
  N('In the morning there is a flower on the sill that nobody planted, and you leave it there.'),
];

/** Juno, outside: she wakes too, and the cat gets the last laugh. */
const JUNO_OUT_STAYED: Line[] = [
  N('A week later your phone buzzes.'),
  JUNO('Witness. I’m outside. I brought the cat. The cat is fine.', 'happy'),
];
const JUNO_OUT_LEFT: Line[] = [
  N('Somewhere across the city a girl wakes up and feeds a cat.'),
  N('You said goodbye properly, and it still counts.'),
];

/** Juno, still in: the board is the only way to reach her. */
const JUNO_IN_STAYED: Line[] = [
  N('Every night a new post appears under yours on the board.'),
  JUNO('Still in. Still counting. Witness.', 'soft'),
  N('You answer every one.'),
];
const JUNO_IN_LEFT: Line[] = [
  N('Her last post sits under yours on the board: “Go well.”'),
  N('Nothing comes after it. You check anyway, most nights.'),
];

export const LOGGED_EXTRA: Scene[] = [
  { id: 'l-end-everyone-wakes-stayed', lines: [...WAKES_BODY, ...JUNO_OUT_STAYED] },
  { id: 'l-end-everyone-wakes-left', lines: [...WAKES_BODY, ...JUNO_OUT_LEFT] },
  { id: 'l-end-quiet-exit-stayed', lines: [...QUIET_BODY, ...JUNO_IN_STAYED] },
  { id: 'l-end-quiet-exit-left', lines: [...QUIET_BODY, ...JUNO_IN_LEFT] },
  { id: 'l-end-one-short-stayed', lines: [...SHORT_BODY, ...JUNO_OUT_STAYED] },
  { id: 'l-end-one-short-left', lines: [...SHORT_BODY, ...JUNO_OUT_LEFT] },
  { id: 'end-logged-everyone-wakes', lines: [N('Logged In: Everyone Wakes.')] },
  { id: 'end-logged-quiet-exit', lines: [N('Logged In: the Quiet Exit.')] },
  { id: 'end-logged-one-short', lines: [N('Logged In: One Short.')] },
];

export const STORYLINE_LOGGED: Storyline = {
  id: 'logged',
  code: 'SL2',
  title: 'Logged In',
  tagline: 'Three partners. Two servers. No log out.',
  source: 'Digimon World 3 (2002): frame and mechanics only',
  audience: 'main',
  speakers: LOGGED_SPEAKERS,
  chapters: LOGGED_CHAPTERS,
  endings: LOGGED_ENDINGS,
  extra: LOGGED_EXTRA,
  notes:
    'Areas: day, night (the Sun and Moon Grove recolours, both unlocked by the rule). The ' +
    'bout button opens the party bout panel at the chapter’s tier. l-c5-thread and l-c6-wage ' +
    'are teen. The lost-partner beat (l-c6-lost) is in chapter 6 only, so a loss elsewhere is ' +
    'carried by the ending.',
};

export const STORYLINE_LOGGED_FLAGS: string[] = [
  'party',
  'area',
  'l-told',
  'l-sister',
  'l-paid',
  'l-root',
  'l-juno',
  'l-end',
];
export const STORYLINE_LOGGED_CHECKS: string[] = [
  ...LOGGED_CHAPTERS.map((c) => c.goal),
  ...LOGGED_CHAPTERS.flatMap((c) => (c.beats ?? []).map((b) => b.when)),
];
