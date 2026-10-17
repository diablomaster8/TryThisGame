/**
 * Storyline S2, "Logged In" (plan G12): the Keeper is a child inside "Grove Online", a
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
 * FLAGS. `party` (three ids, comma-joined), `area` (day | night), `l-sister`
 * (the sibling thread was read), `l-root` (expose | spare), `l-juno` (stayed | left).
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Speaker, Storyline, StorylineChapter } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

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
        JUNO('Yeah. That. It said that on day one. It still says it.', 'sad'),
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
        Y('You knew she tested games. You did not know which.'),
      ],
      set: { 'l-sister': true },
    },
    [
      {
        when: 'mature:teen&act:read-the-board',
        scene: {
          id: 'l-c5-thread',
          lines: [
            N(
              'Further down, a post she deleted and the board kept. The company knew the lock-in was possible. They shipped the build anyway, and paid the testers to stay quiet.',
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
          'Rank four. A door has opened in the lobby. Warden is not permitted to describe it.',
        ),
        N(
          'The door is a plain door in the meadow, with a plain handle, and nothing on the other side you can see.',
        ),
      ],
    },
  ),
  ch(
    7,
    'The Root Node',
    {
      id: 'l-c7-open',
      lines: [
        N(
          'Through the door: a white room with one chair and a recording that starts when you sit.',
        ),
        ROOT(
          'If you are hearing this, the lock has engaged and I am not there to open it. I am sorry. That is not a figure of speech.',
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
        JUNO('Whatever you say after, I’m posting next to you. Witness.'),
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

export const LOGGED_EXTRA: Scene[] = [
  {
    id: 'end-logged-everyone-wakes',
    lines: [
      N(
        'Every scoreboard in the meadow goes white. Then the meadow goes. Then a ceiling, a bedroom, a visor in your hands that smells of your own hair.',
      ),
      N(
        'Down the hall, a door opens that has been shut for a year. Someone says your name as if they have been practising it.',
      ),
      N(
        'In the morning it is on every news site. In the evening three small shapes are asleep on your bed, which should not be possible, and is.',
      ),
      N('Logged In: Everyone Wakes.'),
    ],
  },
  {
    id: 'end-logged-quiet-exit',
    lines: [
      N(
        'A door, one at a time, no questions. You wake in your bedroom with the visor on the floor and nobody saying your name.',
      ),
      N(
        'The game is still up. Juno’s session is still in it. Down the hall, a shut door stays shut.',
      ),
      N(
        'Three small shapes on the bed, looking at you the way they looked at the too-green grass: deciding something.',
      ),
      N('Logged In: the Quiet Exit.'),
    ],
  },
  {
    id: 'end-logged-one-short',
    lines: [
      N(
        'Every scoreboard goes white. You wake. Down the hall a door opens, and someone says your name.',
      ),
      N(
        'Two small shapes on the bed. The third was the one who guarded when they looked at you funny, and did not get up.',
      ),
      N(
        'In the morning there is a flower on the sill that nobody planted, and you leave it there.',
      ),
      N('Logged In: One Short.'),
    ],
  },
];

export const STORYLINE_LOGGED: Storyline = {
  id: 'logged',
  code: 'S2',
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
    'bout button opens the party bout panel at the chapter’s tier. l-c5-thread is teen.',
};

export const STORYLINE_LOGGED_FLAGS: string[] = [
  'party',
  'area',
  'l-sister',
  'l-paid',
  'l-root',
  'l-juno',
];
export const STORYLINE_LOGGED_CHECKS: string[] = LOGGED_CHAPTERS.map((c) => c.goal);
