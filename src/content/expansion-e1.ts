/**
 * Expansion E1, "The Square", for "Hazel’s Grove" (plan G12). A chapter after the ending:
 * the second page of Hazel’s letter mentions the old village square beyond the cottage.
 * Rebuilding it is the arc, through the prosperity system (sim/town.ts): every creature
 * won over moves in, and the square’s services open one by one. If the Corvin ending was
 * earned (`hazels-grove`, Corvin reconciled), Corvin comes back as a reformed recruit and
 * works the bathhouse step.
 *
 * AUDIENCE. 'main' (after the ending; never the Learning Grove).
 *
 * FRAME. Opens the first post-game morning. Never closes: the square takes as long as it
 * takes. Old Pell, a stonemason who laid the square’s first flags, is new here.
 *
 * FLAGS WRITTEN. `e1-corvin` (true once he takes the barrow), `e1Done`.
 * FLAGS READ. `corvin` (reconciled), the ending (through the rule in
 * sim/side-rules-expansions.ts).
 *
 * TONE. Everyday register: dry, warm, specific. Pell is slow and literal; the square is
 * people, not stone.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const PELL = say('e1-pell');
const CORVIN = say('corvin');

export const EXPANSION_E1_SPEAKERS: Speaker[] = [
  { id: 'e1-pell', name: 'Old Pell', kind: 'other' },
];

const letter: Scene = {
  id: 'e1-letter',
  lines: [
    N(
      'A second page, folded small, slips out of the hatch register. Hazel’s hand, later and shakier.',
    ),
    N(
      '“The square past the cottage was the heart once. I let it go to nettles. Someone with slow hands might not.”',
    ),
    Y('Past the cottage. You have walked by it a hundred times and never looked.'),
  ],
};

const square: Scene = {
  id: 'e1-square',
  lines: [
    N(
      'Beyond the cottage wall the ground opens into a square you never saw as one. Flags under moss, a capped well.',
    ),
    N(
      'An old man sits on a block of stone as if he came with it. He nods at the moss, not at you.',
    ),
    PELL('I laid these. Nineteen-seventy. Hazel held the line.'),
    PELL('A square isn’t stone, mind. It’s whoever stands on it. Bring one who’ll stay.'),
  ],
};

const first: Scene = {
  id: 'e1-first',
  lines: [
    PELL('Anyone who wanders in and wanders off again is weather. I want one who stays.'),
    N(
      'He points his chin at the Grove: the wild ones at the patches, the strays at the edge, the dojo, the race posts.',
    ),
    PELL('Win one over. Then we’ll talk about flags.'),
  ],
};

const firstDone: Scene = {
  id: 'e1-first-done',
  lines: [
    N(
      'The first one moves in. Pell watches it pick a corner of the square and sit down in it like a cat choosing a chair.',
    ),
    PELL('There. Now it’s a square.', 'soft'),
  ],
};

const stall: Scene = {
  id: 'e1-stall',
  lines: [
    PELL('Next you want a stall. A square with no stall is a car park.'),
    N('He has the trestle already. He has had it, you suspect, for forty years.'),
  ],
};

const stallDone: Scene = {
  id: 'e1-stall-done',
  lines: [
    N('A trestle, a cloth, a row of fruit that is cheaper than the shop’s and tastes the same.'),
    PELL('Prices come down when people come in. That’s not economics, that’s a square.'),
  ],
};

const gym: Scene = {
  id: 'e1-gym',
  lines: [
    PELL('There was a gym here. Four stations and a bench. The bench is under that nettle.'),
    Y('You pull the nettle. The bench is under it.'),
    PELL('More of them, then. A bench wants sitters.'),
  ],
};

const gymDone: Scene = {
  id: 'e1-gym-done',
  lines: [
    N(
      'The stations come back one by one: a lane, rings, a track, a beam. Nubbins queue for them without being asked.',
    ),
  ],
};

const attendant: Scene = {
  id: 'e1-attendant',
  lines: [
    PELL(
      'The bathhouse step needs someone to mind it. Hazel did, for a year. Said it was restful.',
    ),
    PELL('Find me a few more who’ll stay and I’ll find you a minder.'),
  ],
};

const attendantDone: Scene = {
  id: 'e1-attendant-done',
  lines: [
    N(
      'A recruit takes the bathhouse step with a towel over one arm and the air of someone who has waited a long time for a job.',
    ),
    PELL('Restful. Told you.'),
  ],
};

const attendantCorvin: Scene = {
  id: 'e1-attendant-corvin',
  lines: [
    N(
      'Someone is already on the bathhouse step. Coat brushed, hands folded, a barrow beside him with a mop in it.',
    ),
    CORVIN(
      'I heard there was a square. I thought I might push a barrow round it for a while.',
      'soft',
    ),
    PELL('He turned up at six. Asked where the mop was. I’ve never seen a man so glad of a mop.'),
    CORVIN('I’m not asking for anything. The step wants minding. I can mind a step.'),
    Y('You look at Pell. Pell looks at the mop.'),
    PELL('He stays. Squares are for the ones who come back.'),
  ],
  set: { 'e1-corvin': true },
};

const fortune: Scene = {
  id: 'e1-fortune',
  lines: [
    PELL(
      'There was a fortune teller. Free readings. She was wrong about everything and nobody minded.',
    ),
    PELL('Fill the square a bit more and someone will take the tent.'),
  ],
};

const fortuneDone: Scene = {
  id: 'e1-fortune-done',
  lines: [
    N(
      'A tent goes up by the well. The readings are free. The first one says you will have a good week, and you do.',
    ),
  ],
};

const festival: Scene = {
  id: 'e1-festival',
  lines: [
    PELL(
      'Last thing. A standing festival. Lanterns up, prizes up, the lot. That wants a full square.',
    ),
    N(
      'He stands, which takes a while, and walks the flags, counting the moss he will not have to lift.',
    ),
  ],
};

const festivalDone: Scene = {
  id: 'e1-festival-done',
  lines: [
    N(
      'Bunting. A banner nobody can read because the paint ran. Race prizes up by a shell in seven.',
    ),
  ],
};

const complete: Scene = {
  id: 'e1-complete',
  lines: [
    N(
      'The first festival on the square. Every recruit on it, every stall out, the well uncapped and somebody’s hat in it.',
    ),
    PELL('Nineteen-seventy, she held the line. I never asked who’d hold it after.'),
    Y('You put your hand on the warm stone of the block he sat on.'),
    PELL(
      'Slow hands. She said that about you. I didn’t know what she meant till the nettles.',
      'soft',
    ),
    N(
      'Behind the cottage, in the register, the second page of the letter lies flat for the first time.',
    ),
  ],
};

export const EXPANSION_E1: Quest[] = [
  {
    id: 'e1',
    code: 'E1',
    title: 'The Square',
    source: 'Original (the prosperity system, Digimon World-style town building)',
    audience: 'main',
    trigger: {
      where: 'The cottage table, then the square beyond the cottage',
      when: 'The first morning after the ending',
    },
    speakers: EXPANSION_E1_SPEAKERS,
    steps: [
      {
        id: 'e1-s1',
        goal: 'Walk out past the cottage and look at the square.',
        hint: 'The journal’s button takes you there.',
        check: 'walk:square',
        scene: letter,
        done: square,
      },
      {
        id: 'e1-s2',
        goal: 'Win over one creature who will stay.',
        hint: 'A settled wild visitor, a returned stray, a beaten rival: any of them moves in.',
        check: 'recruits:>=1',
        scene: first,
        done: firstDone,
      },
      {
        id: 'e1-s3',
        goal: 'Fill the square enough for a stall.',
        hint: 'Each recruit raises prosperity. The stall opens at 20.',
        check: 'prosperity:>=20',
        scene: stall,
        done: stallDone,
      },
      {
        id: 'e1-s4',
        goal: 'Bring the gym back.',
        hint: 'Prosperity 40.',
        check: 'prosperity:>=40',
        scene: gym,
        done: gymDone,
      },
      {
        id: 'e1-s5',
        goal: 'Find a minder for the bathhouse step.',
        hint: 'Prosperity 60.',
        check: 'prosperity:>=60',
        scene: attendant,
        done: attendantDone,
      },
      {
        id: 'e1-s6',
        goal: 'Fill the fortune tent.',
        hint: 'Prosperity 80.',
        check: 'prosperity:>=80',
        scene: fortune,
        done: fortuneDone,
      },
      {
        id: 'e1-s7',
        goal: 'Raise the standing festival.',
        hint: 'Prosperity 100.',
        check: 'prosperity:>=100',
        scene: festival,
        done: festivalDone,
      },
    ],
    complete,
    rewards: [
      {
        id: 'square-warden',
        kind: 'title',
        label: 'Square Warden',
        description: 'You held the line after Hazel.',
      },
    ],
    sets: { e1Done: true },
    notes:
      'Steps 2–7 are met by the town system alone (autoOnly). Step 5’s done scene is ' +
      'e1-attendant-corvin when the ending was hazels-grove with Corvin reconciled; the rule ' +
      'spawns Corvin as an NPC and a recruit of species "keeper".',
  },
];

export const EXPANSION_E1_VARIANTS: Scene[] = [attendantCorvin];
export const EXPANSION_E1_FLAGS: string[] = ['e1-corvin', 'e1Done'];
export const EXPANSION_E1_CHECKS: string[] = [
  'walk:square',
  'recruits:>=1',
  'prosperity:>=20',
  'prosperity:>=40',
  'prosperity:>=60',
  'prosperity:>=80',
  'prosperity:>=100',
];
