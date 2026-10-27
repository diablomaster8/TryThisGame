/**
 * Fun quests Q1–Q20: the Python pack (based on Monty Python's films and Flying Circus).
 *
 * Deadpan, escalating silliness. Every word is new except the short approved quotes
 * listed in the brief, each used at most twice and each swapped in `childLines` for the
 * Learning Grove. Character names are newly invented; the source character is in `basedOn`.
 * Audience 'all' throughout. All quests are optional, one time only, never reset, and
 * never set a campaign flag. They do not appear during Chapters 9–11.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** Narrator. */
const N = say('narrator');
/** The player. */
const Y = say('you');
/** Campaign Keepers who appear in this pack. */
const SP = say('sparks');
const PX = say('pixel');
const BY = say('byte');

const WHEN = 'The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)';

// ---------------------------------------------------------------- speakers

const TALL_HOOD: Speaker = {
  id: 'tall-hood',
  name: 'The Tall Hood',
  kind: 'nubbin',
  basedOn: 'The head Knight Who Says Ni (Monty Python and the Holy Grail)',
};
const HOODS: Speaker = {
  id: 'hooded-three',
  name: 'The Hooded Three',
  kind: 'nubbin',
  basedOn: 'The Knights Who Say Ni (Monty Python and the Holy Grail)',
};
const TH = say('tall-hood');
const HS = say('hooded-three');

const DENT: Speaker = {
  id: 'sir-dent',
  name: 'Sir Dentwhistle',
  kind: 'nubbin',
  basedOn: 'The Black Knight (Monty Python and the Holy Grail)',
};
const DW = say('sir-dent');

const GORREL: Speaker = {
  id: 'old-gorrel',
  name: 'Old Gorrel',
  kind: 'keeper',
  basedOn: 'The Bridgekeeper (Monty Python and the Holy Grail)',
};
const GO = say('old-gorrel');

const TROTWELL: Speaker = {
  id: 'trotwell',
  name: 'Trotwell',
  kind: 'nubbin',
  basedOn: 'Patsy, with the coconut halves (Monty Python and the Holy Grail)',
};
const OLLERY: Speaker = {
  id: 'warden-ollery',
  name: 'Warden Ollery',
  kind: 'keeper',
  basedOn: 'The castle guard in the coconut scene (Monty Python and the Holy Grail)',
};
const GULLWICK: Speaker = {
  id: 'gullwick',
  name: 'Gullwick',
  kind: 'nubbin',
  basedOn: 'The coconut-carrying swallow debated by the guards (Monty Python and the Holy Grail)',
};
const OL = say('warden-ollery');
const GW = say('gullwick');

const ROLLO: Speaker = {
  id: 'sir-rollo',
  name: 'Sir Rollo Brisket',
  kind: 'keeper',
  basedOn: 'King Arthur (Monty Python and the Holy Grail)',
};
const SNOWDROP: Speaker = {
  id: 'snowdrop',
  name: 'Snowdrop',
  kind: 'other',
  basedOn: 'The Rabbit of Caerbannog (Monty Python and the Holy Grail)',
};
const RO = say('sir-rollo');

const PARAPET: Speaker = {
  id: 'parapet',
  name: 'Sir Barnabus Parapet',
  kind: 'keeper',
  basedOn: 'The taunter on the castle wall (Monty Python and the Holy Grail)',
};
const PA = say('parapet');

const PIXEL: Speaker = { id: 'pixel', name: 'Pixel', kind: 'keeper' };
const BYTE: Speaker = { id: 'byte', name: 'Byte', kind: 'keeper' };
const SPARKS: Speaker = { id: 'sparks', name: 'Sparks', kind: 'keeper' };

const REGGIE: Speaker = {
  id: 'reggie',
  name: 'Reggie Thistlewood',
  kind: 'keeper',
  basedOn: 'Reg (Monty Python’s Life of Brian)',
};
const FRANNIE: Speaker = {
  id: 'frannie',
  name: 'Frannie Quill',
  kind: 'keeper',
  basedOn: 'Francis (Monty Python’s Life of Brian)',
};
const MAGS: Speaker = {
  id: 'old-mags',
  name: 'Old Mags',
  kind: 'keeper',
  basedOn: 'A member of the People’s Front meeting (Monty Python’s Life of Brian)',
};
const RG = say('reggie');
const FQ = say('frannie');
const MG = say('old-mags');

const BRINDLE: Speaker = {
  id: 'mother-brindle',
  name: 'Mother Brindle',
  kind: 'keeper',
  basedOn: 'Mandy, Brian’s mother (Monty Python’s Life of Brian)',
};
const BARTY: Speaker = {
  id: 'barty',
  name: 'Barty',
  kind: 'nubbin',
  basedOn: 'The crowd of followers (Monty Python’s Life of Brian)',
};
const GOURD_NUBBIN: Speaker = {
  id: 'gourd-nubbin',
  name: 'A Gourd Nubbin',
  kind: 'nubbin',
  basedOn: 'The gourd faction of the followers (Monty Python’s Life of Brian)',
};
const SHOE_NUBBIN: Speaker = {
  id: 'shoe-nubbin',
  name: 'A Shoe Nubbin',
  kind: 'nubbin',
  basedOn: 'The shoe faction of the followers (Monty Python’s Life of Brian)',
};
const MB = say('mother-brindle');
const BT = say('barty');
const GN = say('gourd-nubbin');
const SN = say('shoe-nubbin');

const HARROW: Speaker = {
  id: 'harrow',
  name: 'Harrow Tuppence',
  kind: 'keeper',
  basedOn: 'Harry the haggler (Monty Python’s Life of Brian)',
};
const HT = say('harrow');

const GORBOLD: Speaker = {
  id: 'gorbold',
  name: 'Gorbold',
  kind: 'nubbin',
  basedOn: 'Mr Creosote (Monty Python’s The Meaning of Life)',
};
const CRISP: Speaker = {
  id: 'mr-crisp',
  name: 'Mr Crisp',
  kind: 'keeper',
  basedOn: 'The maître d’ (Monty Python’s The Meaning of Life)',
};
const GB = say('gorbold');
const CR = say('mr-crisp');

const FENWICK: Speaker = {
  id: 'fenwick',
  name: 'Mr Fenwick Mull',
  kind: 'keeper',
  basedOn: 'The pet shop owner in the Dead Parrot sketch (Monty Python’s Flying Circus)',
};
const FM = say('fenwick');

const STRUTT: Speaker = {
  id: 'mr-strutt',
  name: 'Mr Hollis Strutt',
  kind: 'keeper',
  basedOn: 'The Minister of Silly Walks (Monty Python’s Flying Circus)',
};
const ST = say('mr-strutt');

const POUFFE: Speaker = {
  id: 'brother-pouffe',
  name: 'Brother Pouffe',
  kind: 'keeper',
  basedOn: 'Cardinal Ximénez (The Spanish Inquisition, Monty Python’s Flying Circus)',
};
const BOLSTER: Speaker = {
  id: 'brother-bolster',
  name: 'Brother Bolster',
  kind: 'keeper',
  basedOn: 'Cardinal Biggles (The Spanish Inquisition, Monty Python’s Flying Circus)',
};
const TUFT: Speaker = {
  id: 'sister-tuft',
  name: 'Sister Tuft',
  kind: 'keeper',
  basedOn: 'Cardinal Fang (The Spanish Inquisition, Monty Python’s Flying Circus)',
};
const PO = say('brother-pouffe');
const BO = say('brother-bolster');
const TF = say('sister-tuft');

const DIBBLE: Speaker = {
  id: 'mr-dibble',
  name: 'Mr Pomeroy Dibble',
  kind: 'keeper',
  basedOn: 'The owner of the Cheese Shop (Monty Python’s Flying Circus)',
};
const DB = say('mr-dibble');

const PILCHARD: Speaker = {
  id: 'mr-pilchard',
  name: 'Mr Pilchard',
  kind: 'keeper',
  basedOn: 'The smaller dancer in The Fish-Slapping Dance (Monty Python’s Flying Circus)',
};
const GRAMPUS: Speaker = {
  id: 'mr-grampus',
  name: 'Mr Grampus',
  kind: 'keeper',
  basedOn: 'The taller dancer in The Fish-Slapping Dance (Monty Python’s Flying Circus)',
};
const PI = say('mr-pilchard');
const GR = say('mr-grampus');

const GRIMBLE: Speaker = {
  id: 'sgt-grimble',
  name: 'Sergeant Grimble',
  kind: 'keeper',
  basedOn: 'The sergeant major in Self-Defence Against Fresh Fruit (Monty Python’s Flying Circus)',
};
const SG = say('sgt-grimble');

const THACKERY: Speaker = {
  id: 'mrs-thackery',
  name: 'Mrs Thackery',
  kind: 'keeper',
  basedOn: 'The commentator at Upper-Class Twit of the Year (Monty Python’s Flying Circus)',
};
const BUNTY: Speaker = {
  id: 'bunty',
  name: 'The Hon. Bunty Fairweather-Flute',
  kind: 'keeper',
  basedOn: 'A contestant in Upper-Class Twit of the Year (Monty Python’s Flying Circus)',
};
const PIERS: Speaker = {
  id: 'piers',
  name: 'Piers Tumbledown-Hoop',
  kind: 'keeper',
  basedOn: 'A contestant in Upper-Class Twit of the Year (Monty Python’s Flying Circus)',
};
const ALGERNON: Speaker = {
  id: 'algernon',
  name: 'Lord Algernon Spoon',
  kind: 'keeper',
  basedOn: 'A contestant in Upper-Class Twit of the Year (Monty Python’s Flying Circus)',
};
const MT = say('mrs-thackery');
const BU = say('bunty');
const PR = say('piers');
const AL = say('algernon');

const ARBOUR: Speaker = {
  id: 'mr-arbour',
  name: 'Mr Arbour',
  kind: 'keeper',
  basedOn:
    'The narrator of How to Recognise Different Types of Trees from Quite a Long Way Away (Monty Python’s Flying Circus)',
};
const AR = say('mr-arbour');

export const QUESTS_PYTHON: Quest[] = [
  // ------------------------------------------------------------------ Q1
  {
    id: 'q01',
    code: 'Q1',
    title: 'Two Shrubberies',
    source: 'Monty Python and the Holy Grail: the knights who demand a shrubbery',
    audience: 'all',
    trigger: { where: 'The waterfall path, just below the falls', when: WHEN },
    speakers: [TALL_HOOD, HOODS],
    steps: [
      {
        id: 'q01-s1',
        goal: 'Craft a shrubbery at the Workshop and give it to the hooded three.',
        hint: 'The Workshop makes a shrubbery from reeds and wood. Carry it to the falls and use Give.',
        check: 'give:item:shrubbery:tall-hood',
        scene: {
          id: 'q01-intro',
          lines: [
            N('The waterfall path is blocked. Three Nubbins in long brown hoods stand shoulder to shoulder, which for Nubbins is mostly elbow to elbow.'),
            N('The middle one is taller than the others. On closer inspection, it is standing on a log.'),
            HS('Ni!', 'angry'),
            N('Your Nubbin flinches. A small bird leaves a nearby tree and does not come back.'),
            Y('Could we just get past?'),
            TH('You may not. Not until you bring us the thing we require.', 'think'),
            N('There is a long pause, for drama. The hoods sway slightly.'),
            TH('We want… a shrubbery!', 'angry'),
            N('The other two nod gravely. One of them was not expecting it and nods slightly late.'),
          ],
          choices: [
            {
              id: 'what-kind',
              label: 'What sort of shrubbery?',
              then: [
                TH('A nice one. Not too dear.', 'think'),
                N('The hood on the left whispers something. The Tall Hood adds, firmly: “Green.”'),
              ],
            },
            {
              id: 'chant-back',
              label: 'Chant back at them.',
              set: { 'q01-chanted': true },
              then: [
                N('You make the loudest, strangest noise you can manage.'),
                N('The hooded three look at one another. The one on the right writes something down.'),
              ],
            },
            {
              id: 'agree',
              label: 'One shrubbery. Coming up.',
              then: [TH('Good. We shall wait here. Swaying.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q01-first',
          lines: [
            N('You set the shrubbery down. The hooded three lean over it and inspect it from every side, including underneath.'),
            TH('It is a good shrubbery. It has leaves. We approve of the leaves.', 'happy'),
            N('They chant once more, softly, as a kind of thank-you. The bird does not come back for that either.'),
          ],
        },
      },
      {
        id: 'q01-s2',
        goal: 'Make a second shrubbery, a little higher, with a small path, and place it by the first.',
        hint: 'Craft another shrubbery and a path tile, then place both beside the first with the Decorate tool.',
        check: 'place:decor:terraced-shrubbery:waterfall-path',
        scene: {
          id: 'q01-second',
          lines: [
            N('You step towards the path. The Tall Hood raises one paw.'),
            TH('Wait. There is a second thing.', 'think'),
            Y('You said one shrubbery.'),
            TH('We did. We have grown since then. As people.'),
            TH('Bring us another. Set it beside this one, but a little higher, so that it looks terraced.'),
            TH('And a small path down the middle. Not a big path. The sort of path a beetle would enjoy.'),
            N('The other two hoods nod. One holds its paws a beetle-width apart, to help.'),
            Y('And then we can pass?'),
            TH('Then we shall discuss it.', 'happy'),
            TH('Also, we are no longer the Hooded Three. We are now the Hooded Three Who Say—', 'think'),
            N('It makes a noise like a tea tray falling down a staircase full of spoons. The other two join in, slightly behind.'),
            Y('I can’t say that.'),
            TH('Nobody can. That is what makes it so frightening.', 'happy'),
          ],
          choices: [
            {
              id: 'fair',
              label: 'Fine. A little higher, with a path.',
              then: [TH('Good. Use gravel. We have strong feelings about gravel.')],
            },
            {
              id: 'imaginary',
              label: 'Can the path be imaginary?',
              set: { 'q01-imaginary-path': true },
              then: [TH('No. We tried that once. Somebody fell off it.', 'sad')],
            },
          ],
        },
        done: {
          id: 'q01-terraced',
          lines: [
            N('Two shrubberies, one a little higher than the other, with a tiny gravel path wandering between them.'),
            N('It is, you have to admit, rather lovely.'),
            TH('Oh. Oh, that is nice.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'q01-complete',
      lines: [
        N('The hooded three step aside. Then they step back again, because they want to keep looking at the shrubbery.'),
        TH('You may pass. You may pass every day, in fact. We shall be here.'),
        Y('Here? For good?'),
        TH('There is a terrace, and a path. Where else would we go?', 'happy'),
        TH('We guarded this path for years, you know. We never once asked what was at the other end of it.', 'think'),
        TH('A shrubbery is a much better reason to stand somewhere.', 'soft'),
        N('They settle on a flat rock by the falls. One produces a tiny rake and starts tidying the gravel.'),
        N('The terraced shrubbery is yours to move anywhere you like. They hope you won’t. They will forgive you if you do.'),
        N('At dusk you can hear them practising their new name. They have still not got all the way through it.'),
      ],
    },
    rewards: [
      {
        id: 'terraced-shrubbery',
        kind: 'decor',
        label: 'Terraced Shrubbery',
        description: 'Two shrubberies, one a little higher than the other, with a tiny gravel path between them.',
      },
      {
        id: 'q01-hoods-at-falls',
        kind: 'flag',
        label: 'The Hooded Three Stay',
        description: 'The hooded three keep a spot on the flat rock by the falls for good, raking gravel and chanting softly at dusk. Ambient only; no story effect.',
      },
    ],
    sets: { 'q01-hoods-at-falls': true },
    childLines: {
      'q01-intro#2': 'Plink!',
      'q01-intro#7': 'We require… a shrubbery!',
    },
    notes:
      'Three hooded Nubbins (brown cowls, the middle one on a log for height). The chorus speaker is all three at once: ' +
      'stack three voice blips. The chant should be loud enough to shake leaves off the nearest tree (small particle burst). ' +
      'New Workshop recipe needed: shrubbery (reeds + wood). The terraced version is one decor piece made by placing a second ' +
      'shrubbery and a path tile next to the first; the sim should merge them. After completion the hooded three idle on the ' +
      'rock by the falls forever and play a quiet chant at dusk. Approved quotes "Ni!" and "We want… a shrubbery!" each used ' +
      'once; both swapped in childLines. ' +
      'The new-name chant in step 2 is a short clattering sound (tray, stairs, spoons), voiced by all three; at dusk afterwards they attempt it and give up halfway.',
  },

  // ------------------------------------------------------------------ Q2
  {
    id: 'q02',
    code: 'Q2',
    title: 'None Shall Cross',
    source: 'Monty Python and the Holy Grail: the Black Knight',
    audience: 'all',
    trigger: { where: 'The plank bridge over the stream', when: WHEN },
    speakers: [DENT],
    steps: [
      {
        id: 'q02-s1',
        goal: 'Beat Sir Dentwhistle at karate on the plank bridge.',
        hint: 'Choose Karate on the bridge to start a bout. Any of your Nubbins can fight.',
        check: 'karate:win:sir-dent:1',
        scene: {
          id: 'q02-intro',
          lines: [
            N('A plank bridge crosses the stream. In the middle of it stands a Power Nubbin in a dented helmet, perfectly still.'),
            N('It has stood there so long that a snail has started up its leg. It has not noticed, or will not admit it.'),
            Y('Excuse me. We’d like to cross.'),
            DW('None shall pass.', 'angry'),
            N('Its voice echoes inside the helmet. It sounds like someone talking into a bucket.'),
            DW('I am Sir Dentwhistle. I have guarded this plank for three whole days.'),
            DW('Before that it was unguarded. Chaos. People simply walked across it.', 'shock'),
            N('It raises its little fists. If you want to cross, you will have to beat it at karate.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow politely, then fight.',
              then: [DW('A courteous foe. I shall defeat you courteously.', 'happy')],
            },
            {
              id: 'go-round',
              label: 'Can’t we just go round?',
              set: { 'q02-asked-round': true },
              then: [
                N('You look downstream. There is a perfectly good row of stepping stones about ten steps away.'),
                DW('Nobody uses those. They are beneath us. Literally. They are lower.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'q02-round1',
          lines: [
            N('Your Nubbin’s best move sends the dented helmet spinning off into the grass.'),
            N('Underneath, Sir Dentwhistle has very flat hair.'),
            DW("'Tis but a scratch.", 'angry'),
            Y('It was your hat.'),
            DW('A hat is a kind of scratch. A scratch on the head. Again!'),
          ],
        },
      },
      {
        id: 'q02-s2',
        goal: 'Win a second bout against Sir Dentwhistle.',
        hint: 'Same bridge. Swap in a fresher Nubbin if yours is tired; Sir Dentwhistle does not mind.',
        check: 'karate:win:sir-dent:2',
        scene: {
          id: 'q02-scarf',
          lines: [
            N('Sir Dentwhistle wraps a long woollen scarf round its neck three times, for armour.'),
            DW('The scarf is my second line of defence. Nobody has ever got past the scarf.'),
            DW('My mother knitted it. She said nothing would ever get through it. She meant the cold, but the principle stands.', 'think'),
            Y('Has anybody tried?'),
            DW('That is not the point.', 'think'),
            N('It takes up a fighting stance. The stance is mostly scarf.'),
            N('The snail has reached its shoulder and is enjoying the view.'),
          ],
        },
        done: {
          id: 'q02-round2',
          lines: [
            N('The scarf unwinds in one long, satisfying pull and drifts off downstream like a woolly eel.'),
            DW('Barely bothered. I was getting warm anyway.', 'angry'),
            N('Its tiny round glasses have steamed up with fury.'),
          ],
        },
      },
      {
        id: 'q02-s3',
        goal: 'Win the third and final bout.',
        hint: 'If you keep losing, rest your Nubbin first. Tired Nubbins fight slowly.',
        check: 'karate:win:sir-dent:3',
        scene: {
          id: 'q02-glasses',
          lines: [
            N('Sir Dentwhistle wipes its glasses on its own tummy and puts them back on, crooked.'),
            DW('Final round. I have one item left, and it is my best item.'),
            DW('Without these, I cannot see you. Which means you cannot see me either. Logically.', 'think'),
            Y('That isn’t how seeing works.'),
            DW('It is how it works on my bridge.'),
            N('Your Nubbin looks up at you. It would like to win quickly and then have a snack.'),
          ],
          choices: [
            {
              id: 'gentle',
              label: 'Go easy on it.',
              set: { 'q02-gentle': true },
              then: [N('Your Nubbin nods and loosens its shoulders in a merciful way.')],
            },
            {
              id: 'full',
              label: 'Give it everything.',
              then: [N('Your Nubbin cracks its knuckles. It has no knuckles. It cracks them anyway.')],
            },
          ],
        },
        done: {
          id: 'q02-round3',
          lines: [
            N('The glasses fly off and land neatly in the snail’s path. The snail goes round them.'),
            DW('I am completely fine. Never better. Which one of you said that? Both of you?', 'shock'),
            N('It is talking to a fence post.'),
            DW('Come back here! I shall nibble your ankles! All four of them!', 'angry'),
            N('The fence post, to its credit, does not move an inch.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q02-complete',
      lines: [
        N('Sir Dentwhistle sits down on the plank, which is the closest it will ever come to stepping aside.'),
        DW('Very well. You may cross. Not because you won. Because I have decided to have a sit.', 'think'),
        N('You pick the dented helmet out of the grass and offer it back. It pushes it towards you.'),
        DW('Keep it. I have several others. At home. In a box.', 'sad'),
        N('It does not have several others. You can tell from the way it watches the helmet.'),
        DW('And tell your Nubbins this: losing is only losing if you mind. I never mind. I am famous for not minding.', 'happy'),
        N('You cross the plank in two steps. Downstream, the stepping stones look on, unused and faintly hurt.'),
        N('From now on your Nubbins take karate losses the way Sir Dentwhistle does: cheerfully, and slightly wrongly.'),
      ],
      choices: [
        {
          id: 'honours-even',
          label: 'Shall we call it honours even?',
          set: { 'q02-verdict': 'even' },
          then: [
            DW('Honours even. Yes. I was about to suggest it myself. I was being gracious.', 'happy'),
            N('It shakes your hand, and then the fence post’s, to be thorough.'),
          ],
        },
        {
          id: 'tell-plainly',
          label: 'You lost, you know. Three times.',
          set: { 'q02-verdict': 'lost' },
          then: [
            N('Sir Dentwhistle is quiet for a long moment. The snail, now on top of its head, is quiet too.'),
            DW('…I know. I was there.', 'sad'),
            DW('Thank you for saying it plainly. Nobody ever does. It is oddly restful.', 'soft'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'dented-helm',
        kind: 'cosmetic',
        label: 'Dented Helm',
        description: 'A battered little helmet with one proud dent. A hat for your Keeper or any Nubbin.',
      },
      {
        id: 'karate-barely-bothered',
        kind: 'feature',
        label: 'Barely Bothered',
        description: 'Karate perk: losing a bout no longer costs your Nubbin any happiness.',
      },
    ],
    childLines: {
      'q02-intro#3': 'This plank is closed.',
      'q02-round1#2': 'Hardly noticed it.',
    },
    notes:
      'Three karate bouts in a row against one Power Nubbin. Its gear comes off in order: helmet (round 1), scarf (round 2), ' +
      'glasses (round 3); give it an art layer per item so each loss shows. The snail climbs a little higher after each round ' +
      '(purely cosmetic). Sir Dentwhistle should be beatable by a mid-level Nubbin; the point is the jokes, not the challenge. ' +
      'After the quest it sits on the plank permanently and waves as you pass. Approved quotes "None shall pass." and ' +
      '"\'Tis but a scratch." each used once; both swapped in childLines. ' +
      'The complete scene ends on a choice (honours even / tell it plainly) that sets the cosmetic flag q02-verdict; no other effect.',
  },

  // ------------------------------------------------------------------ Q3
  {
    id: 'q03',
    code: 'Q3',
    title: 'The Bridge of Three Questions',
    source: 'Monty Python and the Holy Grail: the Bridge of Death',
    audience: 'all',
    trigger: { where: 'The rope bridge at the edge of the gorge', when: WHEN },
    speakers: [GORREL],
    steps: [
      {
        id: 'q03-s1',
        goal: 'Count every Nubbin in your Grove, then go back to the gorge.',
        hint: 'Open the counter and tap each Nubbin once. Don’t forget the ones hiding in the pond.',
        check: 'count:nubbins:grove',
        scene: {
          id: 'q03-intro',
          lines: [
            N('At the edge of the gorge, beside a rope bridge nobody has ever been allowed on, sits a very old Keeper in a very old hood.'),
            N('The hood has a fringe of moss. So, possibly, does the Keeper.'),
            GO('Halt. Whoever would cross my bridge must answer me three questions.', 'think'),
            GO('Answer rightly, and the bridge is yours. Answer wrongly, and… well. It is a long way down. To the stream.'),
            N('You look down. The stream is knee-deep and full of contented ducks.'),
            GO('First question. How many Nubbins live in your Grove? Exactly. Not roughly. I will know.'),
            Y('I… think I know? Let me check.'),
            GO('Go and count them. I shall wait. I am extremely good at waiting.', 'happy'),
          ],
          choices: [
            {
              id: 'guess',
              label: 'Make a confident guess.',
              set: { 'q03-guessed': true },
              then: [GO('Wrong. Probably. Go and count.', 'angry')],
            },
            {
              id: 'count',
              label: 'Go and count properly.',
              then: [GO('Wise. The last one who guessed is still in the stream. He likes it there now.')],
            },
          ],
        },
        done: {
          id: 'q03-count',
          lines: [
            N('You come back with the number. Old Gorrel checks it against something written on his sleeve.'),
            GO('Correct. Annoyingly.', 'think'),
            GO('Second question. What did your newest Nubbin eat for breakfast?'),
            Y('A run fruit. Half of one. It dropped the other half in the pond.'),
            GO('Correct, and also tragic.', 'sad'),
          ],
        },
      },
      {
        id: 'q03-s2',
        goal: 'Find out how fast a Fly Nubbin can carry a coconut.',
        hint: 'Take a coconut from the palm on the coast, hand it to a Fly Nubbin and time its flight across the pond.',
        check: 'time:fly-nubbin:carry:coconut',
        scene: {
          id: 'q03-third',
          lines: [
            GO('Third question.', 'think'),
            N('He leans forward. The hood leans further. The ducks below go quiet, sensing an occasion.'),
            GO('What is the airspeed velocity of an unladen swallow?'),
            Y('Birds aren’t really my area.'),
            GO('Nor mine. It is written on a very old card. I have never actually seen the bird on it.', 'think'),
            GO('Then a Fly Nubbin. Carrying a coconut. How fast? Go and find out.'),
            N('He sits back, smug as a cushion. Nobody has ever answered the third question.'),
          ],
        },
        done: {
          id: 'q03-timed',
          lines: [
            N('You time two Fly Nubbins. The first carries the coconut briskly across the pond.'),
            N('The second carries it halfway, sits on it, and has a think.'),
            N('So the honest answer is: it depends on the Fly Nubbin. You have a feeling that is the whole point.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q03-complete',
      lines: [
        GO('Well? How fast?', 'happy'),
        Y("What do you mean? An African or European swallow?"),
        N('Old Gorrel opens his mouth. Then he closes it. Then he opens it again, to check it still works.'),
        GO('I… don’t know that. Nobody has ever asked me one back.', 'shock'),
        N('He takes a thoughtful step backwards, onto nothing in particular, and drops neatly into the stream.'),
        N('There is a splash, and then a great deal of indignant quacking.'),
        GO('I’m all right! It’s rather pleasant, actually! The bridge is yours!', 'happy'),
        GO('Forty years of asking people questions. Do you know, it’s rather lovely to be asked one.', 'soft'),
        N('He floats away on his back, waving. Halfway, he flings his hood up onto the rope post. It lands perfectly. He has practised.'),
      ],
    },
    rewards: [
      {
        id: 'gorge-bridge',
        kind: 'feature',
        label: 'Gorge Shortcut',
        description: 'The rope bridge across the gorge opens for good: a shortcut between the orchard side and the far meadow.',
      },
      {
        id: 'bridgekeeper-hood',
        kind: 'cosmetic',
        label: 'Bridgekeeper’s Hood',
        description: 'A very old hood with a fringe of moss. Slightly damp, forever.',
      },
    ],
    childLines: {
      'q03-third#2': 'How fast does a small bird fly, if it isn’t carrying anything?',
      'q03-complete#1': 'Which Fly Nubbin? The quick one, or the one that sits on things?',
    },
    notes:
      'The counter in step 1 is a simple tally overlay: tap each Nubbin once; the sim checks against the real count. ' +
      'Question two is answered automatically from the save (the last fruit your newest Nubbin ate); if it has eaten nothing, ' +
      'swap the line for "Nothing yet. It’s been asleep." via a variant. Step 2 needs a coconut item from the coast palm and ' +
      'a simple timed carry. The fall into the stream must read as harmless: a splash, ducks, him laughing. Afterwards he ' +
      'lives on a rock downstream and waves. The rope bridge becomes walkable. Approved quotes (the swallow question and ' +
      'the reply) each used once; both swapped in childLines, and the line after the swallow question is written to work ' +
      'with either version.',
  },

  // ------------------------------------------------------------------ Q4
  {
    id: 'q04',
    code: 'Q4',
    title: 'Clip-Clop',
    source: 'Monty Python and the Holy Grail: coconut halves for a horse',
    audience: 'all',
    trigger: { where: 'Anywhere on the main path; the Run Nubbin falls in behind you', when: WHEN },
    speakers: [TROTWELL, OLLERY, GULLWICK],
    steps: [
      {
        id: 'q04-s1',
        goal: 'Find out where the coconut shells came from.',
        hint: 'Follow the coast path to the one palm tree and look for whoever has been carrying fruit away from it.',
        check: 'talk:gullwick',
        scene: {
          id: 'q04-intro',
          lines: [
            N('Clop. Clop-clop. Clop.'),
            N('Behind you, a Run Nubbin is trotting in step with you, banging two coconut half-shells together.'),
            N('When you stop, it stops. When you walk, it clops. It looks extremely pleased with the arrangement.'),
            N('Up on the lookout wall, Warden Ollery leans over with a telescope, which at this distance is no help at all.'),
            OL("Where'd you get the coconuts?"),
            Y('They aren’t mine. They’re… its.'),
            OL('Coconuts don’t grow round here. One palm in the whole valley, and that’s on the coast.', 'think'),
            OL('So how did they get all the way up here? I’ve been wondering since breakfast.'),
            OL('Unless two Fly Nubbins carried it between them. On a bit of string. Holding one end each.', 'think'),
            N('He thinks about this for slightly longer than is healthy, then draws a diagram on the wall in chalk.'),
            N('The Run Nubbin clops twice, which might mean anything.'),
          ],
          choices: [
            {
              id: 'ask-nubbin',
              label: 'Ask the Run Nubbin.',
              then: [N('It clops, then points its whole body towards the sea.')],
            },
            {
              id: 'shrug',
              label: 'Does it matter?',
              set: { 'q04-shrugged': true },
              then: [OL('Everything matters, from up here. There’s not much else to look at.', 'sad')],
            },
          ],
        },
        done: {
          id: 'q04-gullwick',
          lines: [
            N('Under the palm sits a Fly Nubbin with enormous, exhausted wings. Its name tag says Gullwick.'),
            GW('Carried it. All the way. Uphill. Into a headwind.', 'sad'),
            GW('Dropped it on a rock at the top. Went in two. Run Nubbin found the halves. Very happy. I am very tired.'),
            N('Gullwick lies down flat in the sand to make the point.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank Gullwick properly.',
              set: { 'q04-thanked-gullwick': true },
              then: [
                N('You thank Gullwick. It lifts one wing an inch off the sand, which is all the wing will do today.'),
                GW('Nobody said that before. Nice. Very tired. Still nice.', 'soft'),
              ],
            },
            {
              id: 'why',
              label: 'Why carry it all that way?',
              then: [
                GW('Seemed like it wanted to go up.', 'think'),
                N('It says this as though it explains everything. Possibly it does.'),
              ],
            },
          ],
        },
      },
      {
        id: 'q04-s2',
        goal: 'Decide what happens to the coconut shells.',
        hint: 'Go back to the lookout wall. The Run Nubbin will follow; talk to it there.',
        check: 'talk:trotwell',
        scene: {
          id: 'q04-return',
          lines: [
            N('You walk back up to the lookout wall. Clop. Clop-clop. The Run Nubbin is right behind you, of course.'),
            Y('A Fly Nubbin carried a whole coconut up from the coast. It broke on a rock.'),
            OL('All that way? With those little wings?', 'shock'),
            OL('Well. Mystery solved. I suppose the shells ought to go back to the beach, really. Tidiness and so on.'),
            N('The Run Nubbin hugs the shells to its chest and looks at you with its whole face.'),
            N('It is the look of someone who has found the one sound they were born to make.'),
          ],
          choices: [
            {
              id: 'keep',
              label: 'They’re yours. Keep them.',
              set: { 'q04-kept': true },
              then: [N('The Run Nubbin does a small celebratory trot in a circle. Clop-clop-clop-clop.')],
            },
            {
              id: 'share',
              label: 'Keep them, but let the others have a turn.',
              set: { 'q04-shared': true },
              then: [N('The Run Nubbin considers this and agrees, provided its turn comes first. And last.')],
            },
          ],
        },
        done: {
          id: 'q04-decided',
          lines: [
            N('The Run Nubbin tucks the shells under one arm and gives you a long, grateful look.'),
            OL('Well, that’s that settled. Clop away, little one.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q04-complete',
      lines: [
        N('The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove. Soon every Nubbin wants a go.'),
        OL('I’ll be honest. I quite like the noise. It’s company.', 'soft'),
        N('As thanks, Trotwell teaches you the trot. It is mostly knees.'),
        N('From now on, when you run, you can swap your footsteps for coconut hooves.'),
        N('Far away on the beach, Gullwick sleeps soundly, wings spread out like a dropped coat.'),
        N(
          'Beside it someone has left a fruit and a note in chalk: “Thank you for the noise. From the wall.”',
        ),
        N(
          'Warden Ollery rubs out the chalk diagram of two Fly Nubbins and a string, slowly, like a man giving up a theory.',
        ),
        OL('I’ll miss the string. It was a good string.', 'sad'),
        N('Trotwell clops once, in sympathy.'),
      ],
    },
    rewards: [
      {
        id: 'clip-clop-mode',
        kind: 'feature',
        label: 'Clip-Clop Mode',
        description: 'A toggle for the Run button: your footsteps become coconut hooves, and your Keeper breaks into a trot.',
      },
    ],
    childLines: {
      'q04-intro#4': 'Where did those shells come from?',
    },
    notes:
      'Trotwell trails the player at a set distance and plays a two-shell clop on every step from the moment the quest ' +
      'starts. Needs a clop sound set (walk and trot tempos) and a trot animation for the Keeper (knees high). Gullwick idles ' +
      'flat on the beach under the palm after the quest. Clip-clop mode is a settings toggle that swaps footstep audio and the ' +
      'run animation only; speed is unchanged. Approved quote "Where\'d you get the coconuts?" used once; swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q5
  {
    id: 'q05',
    code: 'Q5',
    title: 'The Rabbit at the Ledge',
    source: 'Monty Python and the Holy Grail: the killer rabbit and the holy hand grenade',
    audience: 'all',
    trigger: { where: 'The cliff ledge above the falls', when: WHEN },
    speakers: [ROLLO, SPARKS, SNOWDROP],
    steps: [
      {
        id: 'q05-s1',
        goal: 'Ask Sparks to build something that can win over the rabbit.',
        hint: 'Sparks is in the Workshop. Bring one sun fruit; Sparks will need it.',
        check: 'give:item:sun-fruit:sparks',
        scene: {
          id: 'q05-intro',
          lines: [
            N('On the cliff ledge above the falls, a crowd of Nubbins has gathered round something small, white and fluffy.'),
            N('It is a rabbit. It is the size of a slipper. It is chewing a clover with total calm.'),
            RO('Stand back, Keeper. My Nubbins and I have trained for this all week.', 'happy'),
            N('This is Sir Rollo Brisket, a Keeper with a cape, a cardboard crown and a great deal of confidence.'),
            N('His strongest Power Nubbin steps up to the rabbit for a friendly karate bout.'),
            N('There is a white blur. The Power Nubbin is suddenly sitting in a bush some way off, puzzled but fine.'),
            N('The next Nubbin steps up. Blur. Bush. The next. Blur. Same bush. It is getting crowded.'),
            RO('Run away!', 'shock'),
            N('Everyone runs about ten steps, then stops, because the rabbit has gone back to its clover.'),
          ],
          choices: [
            {
              id: 'try',
              label: 'Let your Nubbin try.',
              set: { 'q05-tried': true },
              then: [N('Your Nubbin steps up bravely. Blur. Bush. It climbs out with a leaf on its head, giggling.')],
            },
            {
              id: 'watch',
              label: 'Watch the rabbit for a bit.',
              then: [N('You notice it never starts a fight. It only finishes them, very quickly, and then has a snack.')],
            },
          ],
        },
        done: {
          id: 'q05-sparks',
          lines: [
            SP('A rabbit beat ALL of them? One hit each? Oh, I love that rabbit.', 'happy'),
            SP('Right. Leave it with me. One sun fruit, some ribbon, and a very small amount of fizz.'),
            N('There is a crackle, a small blue flash, and a smell of toasted fruit.'),
          ],
        },
      },
      {
        id: 'q05-s2',
        goal: 'Take the Hand Melon to the ledge, count to exactly three, and toss it.',
        hint: 'Tap Count once per beat and throw on three. Too many or too few and it fizzles; Sparks will make another.',
        check: 'minigame:count:hand-melon:3',
        scene: {
          id: 'q05-melon',
          lines: [
            SP('Behold. The Hand Melon.', 'happy'),
            N('It is a sun fruit with a ribbon round it and a little paper tag. It hums faintly.'),
            Y('It’s not a melon.'),
            SP('Melon sounds braver. Read the tag. The tag is important. I wrote it in my best voice.'),
            N('You turn the tag over. The handwriting is very formal and slightly singed.'),
            SP('Three shall be the number thou shalt count.', 'think'),
            SP('Not two, which is lazy. Not four, which is showing off. Three. Then toss it, gently, near the rabbit. Not at it.'),
            SP('It goes off like a party. Nobody gets hurt. The rabbit loves parties. Probably.'),
          ],
          choices: [
            {
              id: 'practise',
              label: 'Practise counting first.',
              set: { 'q05-practised': true },
              then: [Y('One. Two. Three.'), SP('Perfect. Do exactly that, but with feeling.')],
            },
            {
              id: 'four',
              label: 'What if I count to four?',
              then: [SP('Then it just sits there, disappointed in you. So will I.', 'sad')],
            },
            {
              id: 'rollo',
              label: 'Let Sir Rollo do the honours.',
              set: { 'q05-rollo-counted': true },
              then: [
                RO('Allow me. One… two… several!', 'happy'),
                SP('THREE, Rollo.', 'angry'),
                N('The Hand Melon gives a small, sad fizz in his hand. Sparks takes it back and makes another without a word.'),
              ],
            },
          ],
        },
        done: {
          id: 'q05-pop',
          lines: [
            N('One. Two. Three. You toss the Hand Melon in a gentle arc.'),
            N('It bursts into a shower of fruit confetti: little sweet scraps of every colour, drifting down like snow.'),
            N('The rabbit sits up, ears tall. It has never seen anything so wonderful in its life.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q05-complete',
      lines: [
        N('The white rabbit hops through the confetti, eating as it goes, and stops at your feet.'),
        N('It looks up at you, then at your Nubbin, and very politely does not knock anyone into a bush.'),
        RO('Extraordinary. I had a whole plan. It involved a lot of shouting.', 'think'),
        RO('I suppose it was only ever minding its clover. We were the ones who kept walking up to it.', 'soft'),
        SP('I made you a spare Hand Melon. For the mantelpiece. I took the fizz out, so it’s just pretty.', 'happy'),
        N('The rabbit follows you home. Your Nubbins adore it, and one of them is already trying on its ears.'),
        N('Its name, you decide, is Snowdrop. It agrees by sitting on your foot.'),
      ],
    },
    rewards: [
      {
        id: 'white-rabbit',
        kind: 'cosmetic',
        label: 'Snowdrop the White Rabbit',
        description: 'A small white rabbit critter who lives in your Grove. Nubbins who play with it can take on its fluffy-ears part.',
      },
      {
        id: 'hand-melon',
        kind: 'decor',
        label: 'Hand Melon',
        description: 'A sun fruit tied with ribbon, on a little stand. The fizz has been taken out. It still hums faintly.',
      },
    ],
    childLines: {
      'q05-intro#7': 'Back, everyone! Back!',
      'q05-melon#5': 'Count to three. Exactly three, and then let go.',
    },
    notes:
      'The rabbit is a critter, not a Nubbin. Its "karate" is a one-frame white blur that relocates the opposing Nubbin ' +
      'into a bush with no damage or happiness loss (do not let these bouts count as losses). Bush stacks up visibly. ' +
      'The count minigame: a Count button and a Throw button; exactly three counts then Throw succeeds, anything else fizzles ' +
      'harmlessly with a sad trombone and Sparks hands over another. The burst is fruit-coloured confetti, no smoke or bang. ' +
      'Snowdrop then roams the Grove; a Nubbin that plays with it can gain a fluffy-ears part through the usual part-pickup ' +
      'rule. Approved quotes "Run away!" and "Three shall be the number thou shalt count." each used once; both swapped in ' +
      'childLines.',
  },

  // ------------------------------------------------------------------ Q6
  {
    id: 'q06',
    code: 'Q6',
    title: 'The Wooden Rabbit',
    source: 'Monty Python and the Holy Grail: the Trojan Rabbit and the taunter on the wall',
    audience: 'all',
    trigger: { where: 'The old wall at the far end of the valley', when: WHEN },
    speakers: [PARAPET],
    steps: [
      {
        id: 'q06-s1',
        goal: 'Build a giant wooden rabbit at the Workshop.',
        hint: 'The giant rabbit needs a lot of wood and a set of wheels. The fallen logs by the woods are a good start.',
        check: 'craft:decor:wooden-rabbit',
        scene: {
          id: 'q06-intro',
          lines: [
            N('At the far end of the valley stands an old wall with a little tower on top. On the tower stands a stranger.'),
            N('He has a magnificent moustache and an accent from somewhere very far away, or possibly from nowhere at all.'),
            PA('Hello down there, small Keeper with the small animals! I do not think much of your hat!', 'happy'),
            Y('I’m not wearing a hat.'),
            PA('And I do not think much of that either!'),
            N('A ripe sun fruit sails over the wall and lands on your head. It goes everywhere.'),
            PA("Your mother was a hamster, and your father smelt of elderberries!", 'angry'),
            N('He disappears behind the wall. You can hear him laughing and then, slightly worryingly, eating.'),
            N('He reappears. He has thought of another one, and it has clearly cost him something.'),
            PA('And your Nubbin looks like a sock that has been told a secret!', 'happy'),
            N('Your Nubbin looks down at itself, then up at you, stricken. You tell it it looks nothing like a sock.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout something rude back.',
              set: { 'q06-shouted': true },
              then: [Y('Your… wall is… wonky!'), PA('It is NOT wonky! It has CHARACTER!', 'angry')],
            },
            {
              id: 'dignity',
              label: 'Wipe off the fruit with dignity.',
              then: [N('You wipe off the fruit with great dignity. A second fruit arrives.')],
            },
          ],
        },
        done: {
          id: 'q06-built',
          lines: [
            N('The wooden rabbit is twice as tall as you, with big flat ears and a slightly anxious expression.'),
            N('It is on wheels. It has a little door in its tummy. Nobody can remember why you added the door.'),
          ],
        },
      },
      {
        id: 'q06-s2',
        goal: 'Wheel the wooden rabbit to the stranger’s wall.',
        hint: 'Push it from behind and steer round the stream. It does not float.',
        check: 'push:decor:wooden-rabbit:far-wall',
        scene: {
          id: 'q06-plan',
          lines: [
            N('The wooden rabbit stands outside the Workshop, wheels chocked, ears high.'),
            Y('Right. We wheel it to his wall and leave it at the gate.'),
            N('Your Nubbins nod seriously. They have been told it is a plan. They have not been told the plan.'),
            N('Neither, you realise, have you.'),
            Y('He’ll take it in, and then… something will happen.', 'think'),
            N('That will do. It has wheels. Wheels are a sort of plan in themselves.'),
          ],
        },
        done: {
          id: 'q06-gate',
          lines: [
            N('You leave the rabbit at the gate and hide behind a bush. The gate creaks. The stranger drags the rabbit inside.'),
            N('Behind the bush, everyone looks at everyone. Slowly, it dawns that the rabbit was the whole plan.'),
            Y('…Was somebody meant to be inside it?', 'think'),
            N('Your Nubbins look at their feet. One of them looks at a different, unrelated bush.'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Start laughing.',
              set: { 'q06-laughed': true },
              then: [N('You laugh. Your Nubbins laugh. Behind the wall, the stranger laughs too, though not for the same reason.')],
            },
            {
              id: 'knock',
              label: 'Knock and ask for it back.',
              set: { 'q06-knocked': true },
              then: [PA('Ask for what back? I have no rabbit. I am a man alone with his wall.', 'think')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q06-complete',
      lines: [
        N('Next morning, the wooden rabbit is back outside your Workshop with a note pinned to one ear.'),
        N('“Too big for the courtyard. Also, I found nobody inside it. Very poor attack. Nine out of ten for the ears.”'),
        N('Underneath, in smaller writing: “Your hat is still terrible.”'),
        Y('I’m still not wearing a hat.'),
        N('Right at the bottom, very small, half rubbed out: “P.S. Nobody ever comes to the wall. Come again. Bring something to throw.”'),
        N('The little door in its tummy swings open. There is just room for you and a Nubbin to squeeze in and peek out.'),
        N('It makes, everyone agrees, an excellent spot for photographs.'),
      ],
    },
    rewards: [
      {
        id: 'wooden-rabbit',
        kind: 'decor',
        label: 'Giant Wooden Rabbit',
        description: 'A huge wooden rabbit on wheels. Climb in through the tummy door and peek out of it in Photo mode.',
      },
    ],
    childLines: {
      'q06-intro#6': 'Your boots are muddy, and your Nubbin snores like a kettle!',
    },
    notes:
      'The stranger appears only on the tower; he never comes down. His accent is invented and wobbly (it changes halfway ' +
      'through words); do not base it on any real nationality, and keep his voice blips silly rather than foreign. ' +
      'Fruit drops are harmless and splat with a soft sound; any fruit that lands can be picked up and eaten. New Workshop ' +
      'recipe: wooden rabbit (lots of wood, wheels). Pushing works like moving any heavy decor, with a squeak loop. ' +
      'Overnight the rabbit returns to the Workshop with a note; the tummy door is a Photo mode spot for the Keeper plus one ' +
      'Nubbin. Approved quote (the hamster line) used once; swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q7
  {
    id: 'q07',
    code: 'Q7',
    title: 'It’s Only a Model',
    source: 'Monty Python and the Holy Grail: Camelot',
    audience: 'all',
    trigger: { where: 'The top of the little hill', when: WHEN },
    speakers: [PIXEL, BYTE],
    steps: [
      {
        id: 'q07-s1',
        goal: 'Gather 12 stone for the castle towers.',
        hint: 'Stone turns up in the riverbed and under the cliffs. Tap a sparkling rock to pick it up.',
        check: 'gather:item:stone:12',
        scene: {
          id: 'q07-intro',
          lines: [
            N('On top of the little hill, Pixel is kneeling beside a castle. It is about knee-high.'),
            N('It has a gate, a drawbridge made from a lolly stick, and two towers that stop halfway up, as if they lost interest.'),
            PX('Keeper! Behold! The Grand Palace of the Hill!', 'happy'),
            N('Pixel turns to the valley, arms wide, and announces it again, louder, to everyone and no one.'),
            PX('Gaze upon it, all ye Grove! Marvel at its towers! Well. Marvel at the bottom halves of its towers.'),
            N('Byte comes up the path with a cup of tea, looks at the castle, and does not slow down.'),
            BY("It's only a model."),
            PX('SHH.', 'angry'),
            PX('It needs proper stone towers. Real ones. Little ones. Will you help? Byte clearly won’t.'),
            BY('I am drinking my tea.', 'think'),
            N('There is a tea stain on the lolly-stick drawbridge. Byte moves his cup behind his back.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Of course. Grand palace it is.',
              then: [PX('Thank you. Byte, write that down. Somebody believes.', 'happy')],
            },
            {
              id: 'small',
              label: 'It is quite small.',
              set: { 'q07-said-small': true },
              then: [PX('It is to SCALE. There is a difference.', 'angry'), BY('There is not.')],
            },
          ],
        },
        done: {
          id: 'q07-stone',
          lines: [
            N('You bring Pixel an armful of stone. Pixel weighs each piece in one hand like a jeweller.'),
            PX('This one is a tower. This one is a battlement. This one is… a nice stone. Keep that one.'),
          ],
        },
      },
      {
        id: 'q07-s2',
        goal: 'Finish the castle’s towers with Pixel.',
        hint: 'Place stones on the glowing spots at the top of each tower. Twelve in all.',
        check: 'build:decor:model-castle:towers',
        scene: {
          id: 'q07-towers',
          lines: [
            PX(
              'Now. The towers. Hold this, hold that, and whatever happens, do not breathe on the east wing.',
              'think',
            ),
            N(
              'You build together. Pixel places, you hold, and your Nubbin hands up stones one at a time with great ceremony.',
            ),
            N('One Nubbin hands Pixel a stone. Pixel says it is the wrong stone.'),
            N('The Nubbin hands her the same stone again, with more conviction.'),
            PX('Better.', 'happy'),
            N(
              'Every few minutes Pixel stands back, squints, and moves one stone a hair to the left.',
            ),
            BY('You moved that one back to where it was.'),
            PX('I moved it MORE to where it was.'),
            N('The towers rise, stone by stone. They reach your knee. Then a little over your knee.'),
            N('A cloud passes. For one moment, lying flat in the grass at the right angle, the castle looks enormous. Then the sun comes back.'),
          ],
        },
        done: {
          id: 'q07-finished',
          lines: [
            N('The last stone goes on. Two proud towers, a lolly-stick drawbridge, and a flag made from a sweet wrapper.'),
            PX('Grove! The Grand Palace is COMPLETE!', 'happy'),
            N('The valley echoes back, faintly: “…plete.” Pixel takes this as applause.'),
            N('Far below, a Nubbin by the pond looks up, waves, and goes back to its puddle.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q07-complete',
      lines: [
        N('That evening, three Nubbins wander up the hill and stop in front of the castle.'),
        N('One puts a leaf on its head like a crown. One stands on the drawbridge and points dramatically at nothing.'),
        N('The third lies down and plays a dragon, or a cloud. It is hard to say. It commits completely.'),
        PX('They’re putting on a play. In my palace. This is the best day of my whole life.', 'soft'),
        BY('Still quite small, I’d say…', 'think'),
        N('Byte stops, watches the leaf-crowned Nubbin take a very small bow, and sips the tea instead.'),
        BY('It is a very good model.', 'soft'),
        BY('The drawbridge is load-bearing. I tested it. Twice.'),
      ],
    },
    rewards: [
      {
        id: 'model-castle',
        kind: 'decor',
        label: 'Model Castle',
        description: 'Pixel’s knee-high Grand Palace. Now and then, Nubbins gather in front of it and put on a little play.',
      },
    ],
    childLines: {
      'q07-intro#6': 'It’s about the size of a footstool.',
    },
    notes:
      'The castle is a decor piece with two states (half towers, full towers); step 2 is a placing minigame of twelve glowing ' +
      'spots. The "little play" is an idle event: when three or more Nubbins are near the castle at dusk, there is a small ' +
      'chance they act out a scene (leaf crown, pointing, one lying down as a dragon or cloud) for about 20 seconds. ' +
      'Pixel shouting to the valley should echo once. Approved quote "It\'s only a model." used once; swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q8
  {
    id: 'q08',
    code: 'Q8',
    title: 'What Has the Aqueduct Done for Us?',
    source: 'Monty Python’s Life of Brian: “What have the Romans ever done for us?”',
    audience: 'all',
    trigger: { where: 'The Keepers’ Hall, during a committee meeting', when: WHEN + ', once you have built at least three things' },
    speakers: [REGGIE, FRANNIE, MAGS],
    steps: [
      {
        id: 'q08-s1',
        goal: 'Build an aqueduct from the falls to your crops.',
        hint: 'Craft aqueduct sections at the Workshop from stone and wood, then lay them from the top of the falls to the crop beds.',
        check: 'build:decor:aqueduct:falls-to-crops',
        scene: {
          id: 'q08-intro',
          lines: [
            N('In the Keepers’ Hall, a meeting is in progress. There are four chairs, three Keepers and a lot of paper.'),
            N('A banner on the wall says GROVE IMPROVEMENT COMMITTEE. Someone has crossed out IMPROVEMENT.'),
            RG('Order. Order. Item one: all this building the new Keeper keeps doing.', 'angry'),
            FQ('Fences everywhere. Paths. Lanterns. Something with a drawbridge, apparently.'),
            MG('My cousin tripped over a fence post. A new one.'),
            RG('What have the Romans ever done for us?', 'angry'),
            N('There is a pause. Frannie raises a hand.'),
            FQ('Reggie. There aren’t any Romans. There’s just the Keeper. They’re sitting right there.'),
            RG('It’s a figure of speech, Frannie. A very well-known figure of speech.', 'think'),
            RG('Anyway. If you must build, Keeper, build something USEFUL. The crops are parched and my back is gone from carrying buckets.'),
          ],
          choices: [
            {
              id: 'aqueduct',
              label: 'Fine. I’ll build an aqueduct.',
              then: [
                RG('A what?'),
                Y('A sort of bridge, for water.'),
                RG('Pfft. Sounds like more building.', 'angry'),
              ],
            },
            {
              id: 'minutes',
              label: 'Can I see the minutes?',
              set: { 'q08-read-minutes': true },
              then: [N('The minutes say, in full: “Met. Grumbled. Biscuits.”')],
            },
          ],
        },
        done: {
          id: 'q08-water',
          lines: [
            N('The last section clicks into place. Water from the falls slides down the channel, glittering, and spills into the crop beds.'),
            N('The crops do a small, grateful droop-then-perk. Your Nubbins jump about in the overflow.'),
          ],
        },
      },
      {
        id: 'q08-s2',
        goal: 'Harvest a crop from the aqueduct beds and take it to the committee.',
        hint: 'Ripe crops glow. Tap to harvest, then Give it to Reggie in the Keepers’ Hall.',
        check: 'give:item:crop:reggie',
        scene: {
          id: 'q08-invite',
          lines: [
            N('A note arrives, folded into a very small square.'),
            N('“Emergency meeting. Re: the aqueduct. Bring something from the crops so we can examine it. Reggie.”'),
            N('Underneath, in different handwriting: “Bring biscuits too. Frannie.”'),
            N('A second note arrives a minute later: “Ignore the first note. The Committee for Grove Improvement is the only real committee. Breakaways! Mags.”'),
            N('You were not aware there were two committees. By lunchtime there are three, and nobody is sure who is in the third.'),
            Y('Examine it for what?'),
            N('Your Nubbin, dripping from the overflow, has no idea either, and does not mind.'),
            N('The crop beds beside the aqueduct are already plump and shining.'),
          ],
        },
        done: {
          id: 'q08-delivered',
          lines: [
            N('Reggie takes the crop, turns it over, sniffs it, and holds it up to the light for a suspiciously long time.'),
            RG('Hmm. It’s very good. I hate that it’s very good.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'q08-complete',
      lines: [
        RG('Item one. The aqueduct. All right. Apart from watering the crops, what has the aqueduct done for us?', 'angry'),
        FQ('The Nubbins love the spray. They’ve stopped asking me for baths.'),
        MG('The frogs moved in. I like the frogs.'),
        FQ('It hums at night. Very soothing.'),
        MG('My cousin can’t trip over it. It’s up in the air.'),
        RG('Fine. But apart from the crops, the baths, the frogs, the humming and your cousin—', 'angry'),
        FQ('It keeps the path cool in summer.'),
        MG('It’s pretty.', 'soft'),
        FQ(
          'You’ve filled our teapot from it every morning since Tuesday, Reggie. I married you. I notice things.',
        ),
        RG('That was a private teapot.', 'sad'),
        FQ('Dear. It’s a municipal aqueduct.'),
        RG('…Motion to thank the Keeper. All in favour.', 'sad'),
        N('Every hand goes up, Reggie’s last and slowly.'),
        N('Frannie pulls out the fourth chair for you. It has had your name on it since item one.'),
        MG('Biscuit?'),
        N('The crops beside the aqueduct will never need watering again.'),
      ],
    },
    rewards: [
      {
        id: 'aqueduct',
        kind: 'feature',
        label: 'Aqueduct',
        description: 'A stone channel from the falls to your crop beds. Crops beside it never need watering again.',
      },
    ],
    childLines: {
      'q08-intro#5': 'What has all this building ever done for us?',
      'q08-intro#7': 'Reggie. It’s done quite a lot. You’re sitting on a bench the Keeper built.',
      'q08-intro#8': 'That is not the point, Frannie. The point is the principle.',
    },
    notes:
      'The aqueduct is a chain of decor sections that must connect the falls to at least one crop bed; any crop plot ' +
      'touching it is marked permanently watered (dryPerMinute ignored). Add frogs and a soft night-time hum near it as ' +
      'ambient flavour. The committee meets around a table in the Keepers’ Hall; Reggie, Frannie and Old Mags can reuse ' +
      'generic Keeper bodies with new heads. Approved quote ("What have the Romans ever done for us?") used once; swapped in ' +
      'childLines, and the two lines after it are also swapped so the Learning Grove version still makes sense. ' +
      'Old Mags’s speaker id is `old-mags`, kept apart from `mags` (the adult Sunny pack’s Mags) in any shared speaker registry.',
  },

  // ------------------------------------------------------------------ Q9
  {
    id: 'q09',
    code: 'Q9',
    title: 'The Gourd and the Shoe',
    source: 'Monty Python’s Life of Brian: the crowd of followers',
    audience: 'all',
    trigger: { where: 'The long loop path, on an evening walk', when: WHEN },
    speakers: [BARTY, GOURD_NUBBIN, SHOE_NUBBIN, BRINDLE],
    steps: [
      {
        id: 'q09-s1',
        goal: 'Go back for your shoe.',
        hint: 'You left it by the ditch on the long loop. The crowd will follow you there, whatever you do.',
        check: 'find:item:lost-shoe',
        scene: {
          id: 'q09-intro',
          lines: [
            N('You are halfway round your evening walk when the strap on your bag snaps. A small gourd rolls into the ditch.'),
            N('You bend to fetch it, and your shoe comes off in the mud with a noise like a kiss.'),
            N('You leave them both. It has been a long day. You will come back for them.'),
            N('When you look round, a small crowd of Nubbins has gathered by the gourd and the shoe, very quietly.'),
            N('They look at you. Then they look at each other. Then they start following you, at a respectful distance.'),
            BT('It is a sign!', 'shock'),
            Y('It’s a gourd. And a shoe.'),
            BT('It is TWO signs!', 'happy'),
          ],
          choices: [
            {
              id: 'stop',
              label: 'Please stop following me.',
              then: [N('They stop. Then they all take one step after you, very slowly, in case that doesn’t count.')],
            },
            {
              id: 'faster',
              label: 'Walk faster.',
              set: { 'q09-walked-faster': true },
              then: [N('They walk faster. A little Nubbin at the front carries the gourd above its head like a lantern.')],
            },
          ],
        },
        done: {
          id: 'q09-split',
          lines: [
            N('By the time you reach the ditch, the crowd has split in two.'),
            N('Half are bowing to the shoe, which they have set on a rock. The other half are holding up the gourd and humming.'),
            GN('The gourd is round, like the sun. Round things are never wrong.'),
            SN('The shoe has laces. Nobody understands laces. Follow the laces.', 'angry'),
            N('A third, much smaller group has gathered round a pebble that was near the shoe. Neither of the other camps will speak to them.'),
          ],
        },
      },
      {
        id: 'q09-s2',
        goal: 'Settle the argument between the gourd camp and the shoe camp.',
        hint: 'Wear the gourd and the shoe where both camps can see. Tap each in your bag and choose Wear.',
        check: 'wear:item:gourd+lost-shoe',
        scene: {
          id: 'q09-mother',
          lines: [
            N(
              'A Keeper in a headscarf marches up the path, rolling up her sleeves. This is Mother Brindle, Barty’s Keeper, who hatched him. She is not pleased.',
            ),
            MB('What’s all this, then? Barty! Is that you at the front?', 'angry'),
            BT('Mother! The signs!', 'happy'),
            GN('Barty saw the signs first. Barty is very special.'),
            MB("He's not the Messiah. He's a very naughty boy!", 'angry'),
            BT('I am a bit naughty.', 'soft'),
            MB('It’s past his bedtime. And yours, all of you.'),
            MB(
              'Sort this out, will you? Nobody listens to me. I’m only his mother. Well. I hatched him. Same thing.',
              'sad',
            ),
          ],
          choices: [
            {
              id: 'both',
              label: 'Tell them both are signs.',
              set: { 'q09-ruling': 'both' },
              then: [N('Both camps cheer, then look at each other suspiciously, then cheer again, slightly less.')],
            },
            {
              id: 'neither',
              label: 'Tell them it’s just things you dropped.',
              set: { 'q09-ruling': 'neither' },
              then: [
                N(
                  'Nobody believes you. They say only a very special Keeper would say that. Mother Brindle sighs.',
                ),
              ],
            },
            {
              id: 'themselves',
              label: 'Tell them to think for themselves.',
              set: { 'q09-ruling': 'themselves' },
              then: [
                Y('You don’t need to follow me. Any of you. You can all think for yourselves!'),
                N('The whole crowd nods, together, in perfect time. Then it waits for you to say what to think.'),
                BT('What should we think first?', 'happy'),
                N('Mother Brindle puts her face in her hands.'),
              ],
            },
          ],
        },
        done: {
          id: 'q09-hats',
          lines: [
            N('You put the gourd on your head. Then, after a moment’s thought, you balance the shoe on top of the gourd.'),
            N('Both camps gasp. Both camps are right. Nobody can argue with that.'),
            BT('Follow the Keeper!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q09-complete',
      lines: [
        N('The whole crowd falls in behind you in one long, happy, wobbling line.'),
        N('You walk to the pond. They walk to the pond. You turn round. They turn round, and bump into each other.'),
        N('When you finally stop, they stop, sit down and fall asleep in a heap, with Barty on top.'),
        MB('Thank you, love. Keep the gourd. And the shoe. I don’t want them in my house; they’ll only start something.', 'soft'),
        N('From now on, if you call “Follow me”, every Nubbin in the Grove will trail behind you in a parade until you stop.'),
      ],
    },
    rewards: [
      {
        id: 'gourd-hat',
        kind: 'cosmetic',
        label: 'Gourd Hat',
        description: 'A small, round, faintly important-looking gourd. Worn on the head.',
      },
      {
        id: 'shoe-hat',
        kind: 'cosmetic',
        label: 'Shoe Hat',
        description: 'Your old muddy shoe, worn proudly on top of your head. Stacks on the Gourd Hat.',
      },
      {
        id: 'follow-me',
        kind: 'feature',
        label: 'Follow Me',
        description: 'A new call: every Nubbin in the Grove falls in behind you in a parade until you stand still.',
      },
    ],
    childLines: {
      'q09-mother#4': 'He’s not a leader. He’s a little scamp who should be in bed!',
    },
    notes:
      'The quest triggers on a walk along the long loop: play the drop and the lost shoe as a short cut-in, then hide the ' +
      'player’s shoe (one bare foot until step 2, purely cosmetic). The crowd is 6–10 wild Nubbins who trail the player at ' +
      'a distance and split into two groups at the ditch, each with its own idle: bowing (shoe) and humming (gourd). ' +
      'Barty is a small Nubbin who always walks at the front. "Follow me" is a new call on the whistle or call button; the ' +
      'parade ends when the Keeper stands still for two seconds, and Nubbins then sit and nap in a heap. Keep everything ' +
      'gentle and non-religious beyond the one approved quote, used once and swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q10
  {
    id: 'q10',
    code: 'Q10',
    title: 'Haggle',
    source: 'Monty Python’s Life of Brian: haggling at the market',
    audience: 'all',
    trigger: { where: 'A new stall by the market path', when: WHEN },
    speakers: [HARROW],
    steps: [
      {
        id: 'q10-s1',
        goal: 'Offer Harrow less than he is asking for the brass bell.',
        hint: 'Tap the bell and choose Haggle instead of Buy. Start low. Lower than feels polite.',
        check: 'shop:offer:harrow:below-asking',
        scene: {
          id: 'q10-intro',
          lines: [
            N('There is a new stall by the market path, piled with odds and ends. Behind it sits a Keeper with a pencil behind each ear.'),
            HT('Morning! Harrow Tuppence. Everything a Grove could want, and several things it couldn’t.', 'happy'),
            N('You spot a little brass bell. Your Nubbin spots it too and makes a small, longing noise.'),
            Y('How much is the bell?'),
            HT('Twenty Shells.'),
            N('You count out twenty Shells and hold them out.'),
            N('Harrow stares at the Shells. Then at you. His face falls by about a mile.'),
            HT('Twenty? Just like that? You’re not even going to try?', 'shock'),
            HT('Put those away. I can’t take that. It’s insulting. To both of us. To the bell.', 'angry'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Sorry. How does this work?',
              then: [HT('You say a number. I say a bigger number. We weep. We meet in the middle. We shake. It’s beautiful.', 'soft')],
            },
            {
              id: 'tag',
              label: 'Twenty is what the tag says.',
              set: { 'q10-stubborn': true },
              then: [HT('The tag is the OPENING. Nobody listens to the tag. The tag is a cry for help.', 'angry')],
            },
          ],
        },
        done: {
          id: 'q10-first-offer',
          lines: [
            Y('…Eight Shells?'),
            HT('EIGHT?', 'shock'),
            N('He clutches the stall. He clutches his heart. He clutches the bell, protectively.'),
            HT('Now we’re talking. Oh, that’s lovely. Do go on.', 'happy'),
          ],
        },
      },
      {
        id: 'q10-s2',
        goal: 'Haggle with Harrow through three full rounds.',
        hint: 'Each round, offer something between your last number and his. Agree too fast and he starts again.',
        check: 'minigame:haggle:harrow:3-rounds',
        scene: {
          id: 'q10-rounds',
          lines: [
            HT('Right. Proper rules. Three rounds. I go down, you go up, and we both pretend to leave at least once.', 'think'),
            HT('Don’t meet me too quick, that’s rude. Don’t hold out too long, that’s also rude. Somewhere in between is an art.'),
            N('Your Nubbin climbs onto the counter to watch. This is clearly the best thing that has ever happened in a shop.'),
            HT('Twenty. For you. Because I like your face.'),
            Y('Ten.'),
            HT('Ten? For a BELL? It rings in two keys, you know. Eighteen.', 'angry'),
          ],
          choices: [
            {
              id: 'walk',
              label: 'Pretend to walk away.',
              set: { 'q10-walked-off': true },
              then: [N('You get three steps. Harrow calls out “Sixteen!” in a voice of real anguish.')],
            },
            {
              id: 'admire',
              label: 'Admire the bell, then go lower.',
              then: [HT('Flattery AND a low offer. Who taught you that? Me. I did. Just now.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q10-deal',
          lines: [
            HT('Fourteen. My final offer. I’ll be ruined. My children will eat gravel.', 'sad'),
            Y('You don’t have children.'),
            HT('Fourteen, then, and nobody eats gravel.', 'happy'),
            N('You shake on it. Harrow’s eyes are a little wet. He says it’s the wind.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q10-complete',
      lines: [
        N('You hand over fourteen Shells. Harrow counts them twice, tenderly, like a man counting doves.'),
        HT('That, Keeper, was a proper bit of business. Best I’ve had all week. Only one I’ve had all week.', 'happy'),
        N('He presses a small gourd into your hands as well. “Free. Nobody haggles over a gourd. Dreadful things, gourds.”'),
        N('Your Nubbin rings the brass bell. It does, in fact, ring in two keys.'),
        HT('Tell you what. I’ve had a word with the shop. You can haggle there too, now. Anything you buy.', 'think'),
        HT('They won’t go lower than a fifth off. And you have to mean it. Shopkeepers can tell.'),
        N('From now on, any purchase in the shop can start with a bit of haggling, for up to 20% off.'),
      ],
      choices: [
        {
          id: 'tip',
          label: 'Slip him the six Shells you saved.',
          set: { 'q10-tipped': true },
          then: [
            HT('Don’t you DARE.', 'angry'),
            HT('A deal’s a deal. Pay twenty now and the whole morning meant nothing. Put it away.'),
            N('You put it away. He looks, for some reason, enormously proud of you.'),
          ],
        },
        {
          id: 'shake',
          label: 'Shake on it again, for luck.',
          then: [N('You offer your hand. He haggles you down to a slightly shorter handshake, and looks delighted.')],
        },
      ],
    },
    rewards: [
      {
        id: 'shop-haggling',
        kind: 'feature',
        label: 'Haggling',
        description: 'An optional Haggle option on any shop purchase: three rounds of back-and-forth that can take up to 20% off.',
      },
    ],
    notes:
      'No source quotes; all lines are new. The brass bell is an ordinary purchase (14 Shells, not a reward); if the player ' +
      'has fewer than 8 Shells, Harrow says he will hold it for them and the quest waits. Haggle minigame: three rounds, ' +
      'each a slider between the last two numbers; accepting his first price restarts the round with a wounded line. The ' +
      'same three-round mini-dialogue then becomes optional on every shop purchase, with the best result capped at 20% off ' +
      'and a small cooldown per item so it cannot be farmed.',
  },

  // ------------------------------------------------------------------ Q11
  {
    id: 'q11',
    code: 'Q11',
    title: 'Wafer-Thin',
    source: 'Monty Python’s The Meaning of Life: the wafer-thin mint',
    audience: 'all',
    trigger: { where: 'The bathhouse', when: WHEN },
    speakers: [GORBOLD, CRISP],
    steps: [
      {
        id: 'q11-s1',
        goal: 'Pick fresh mint for Mr Crisp.',
        hint: 'Mint grows in a small patch by the pond. Tap the top leaves, then Give them to Mr Crisp.',
        check: 'give:item:mint-leaves:mr-crisp',
        scene: {
          id: 'q11-intro',
          lines: [
            N('At the bathhouse, the steam is thick and the snack table is empty. Very, very empty.'),
            N('In the middle of the warm pool floats a Nubbin so round it has stopped needing to swim. It simply bobs.'),
            N('This is Gorbold. Around it float a great many fruit stones, a crust, and one sad lettuce leaf.'),
            GB('More.', 'happy'),
            N('A Keeper in a crisp white apron appears at your elbow, with a silver tray and a cloth over one arm.'),
            CR('Good afternoon. Mr Crisp, head of refreshments. Gorbold has eaten the menu. Not the food on it. The menu.', 'think'),
            CR('Before that, the fruit. Then the fruit bowl. Then the little table the bowl was on, and a decorative fern.'),
            CR('I have one thing left to serve, and I cannot make it without fresh mint. Might you fetch some?'),
            Y('Is that wise? It looks very full.'),
            CR('It is a VERY small thing.', 'happy'),
          ],
          choices: [
            {
              id: 'fetch',
              label: 'I’ll fetch the mint.',
              then: [CR('Splendid. The patch by the pond. Only the top leaves, please. I am particular.')],
            },
            {
              id: 'ask',
              label: 'Ask Gorbold if that’s all right.',
              set: { 'q11-asked-gorbold': true },
              then: [GB('More.', 'happy'), N('That seems to be a yes.')],
            },
          ],
        },
        done: {
          id: 'q11-mint',
          lines: [
            CR('Perfect. Give me one moment.', 'happy'),
            N('He vanishes into the steam. There is a sound of very fine slicing.'),
          ],
        },
      },
      {
        id: 'q11-s2',
        goal: 'Stay and watch Gorbold take the last slice.',
        hint: 'Stay in the bathhouse. If you leave, Gorbold waits politely for you to come back.',
        check: 'watch:gorbold:wafer-slice',
        scene: {
          id: 'q11-slice',
          lines: [
            N('Mr Crisp returns. On the silver tray lies one slice of minty something, so thin you could read through it.'),
            CR('For you, sir. One more slice. Just a sliver.', 'soft'),
            GB('Full.', 'sad'),
            CR("It's only wafer-thin."),
            N('Gorbold considers the slice. It considers you. You consider the exits.'),
            N('Mr Crisp holds out the tray. The steam goes very still.'),
          ],
          choices: [
            {
              id: 'nudge',
              label: 'Go on. It is very thin.',
              set: { 'q11-nudged': true },
              then: [GB('…Fine.')],
            },
            {
              id: 'step-back',
              label: 'Take a big step back.',
              set: { 'q11-stepped-back': true },
              then: [N('Mr Crisp, without looking, takes a big step back too. He has done this before.')],
            },
          ],
        },
        done: {
          id: 'q11-pop',
          lines: [
            N('Gorbold eats the slice. There is a pause, a small hiccup, and then a soft POP.'),
            N('A great cloud of glittering confetti fills the bathhouse and settles gently on the water.'),
            N('When it clears, Gorbold is bobbing in the pool, normal-sized, blinking, and looking extremely pleased.'),
            GB('Light!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q11-complete',
      lines: [
        CR('Ah. The usual outcome. Lovely.', 'happy'),
        N('Mr Crisp produces a little broom and sweeps the confetti into a perfect pile without a speck landing on his apron.'),
        CR('For your trouble. My own recipe.'),
        N('He hands you a paper packet of wafer-thin slices, and a napkin bib with a tiny embroidered mint leaf.'),
        CR('One slice fills a Nubbin to exactly full. Never over. I have had quite enough of over for one day.', 'think'),
        GB('More?', 'happy'),
        CR('No.'),
        N('Gorbold bobs over to your Nubbin and nudges a single fruit stone across the water towards it.'),
        GB('Yours.', 'soft'),
        N('Mr Crisp stops sweeping. In eleven years he has never once seen Gorbold give anything away.'),
      ],
    },
    rewards: [
      {
        id: 'wafer-thin-slice',
        kind: 'item',
        label: 'Wafer-Thin Slice',
        description: 'A minty slice so thin you can read through it. Fills a Nubbin’s hunger to exactly full, never over.',
      },
      {
        id: 'napkin-bib',
        kind: 'cosmetic',
        label: 'Napkin Bib',
        description: 'A crisp white bib with a tiny embroidered mint leaf. For Keepers or Nubbins.',
      },
    ],
    childLines: {
      'q11-slice#3': 'Only a sliver. You will hardly notice it.',
    },
    notes:
      'Keep this entirely gentle: Gorbold is round and bobbing, never sick, and the pop is a soft sound with glitter confetti, ' +
      'no mess, no splatter. Afterwards Gorbold is a normal-sized Nubbin who lives at the bathhouse and says "More?" when ' +
      'tapped. The wafer-thin slice is a restockable item (the shop sells it after this quest) that sets hunger to exactly ' +
      '1.0 and never overfeeds. Mint is a new pickable plant by the pond. Approved quote "It\'s only wafer-thin." used once; ' +
      'swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q12
  {
    id: 'q12',
    code: 'Q12',
    title: 'Just Resting',
    source: 'Monty Python’s Flying Circus: the Dead Parrot',
    audience: 'all',
    trigger: { where: 'Your nest, when a parcel from the shop arrives', when: WHEN + ', once you have bought anything from the shop' },
    speakers: [FENWICK],
    steps: [
      {
        id: 'q12-s1',
        goal: 'Collect three pieces of evidence that the shop’s Nubbin isn’t real.',
        hint: 'Try feeding it, tickling it, and putting it in the pond. Watch carefully each time.',
        check: 'collect:evidence:plush-nubbin:3',
        scene: {
          id: 'q12-intro',
          lines: [
            N('A parcel arrives from the shop. Inside, in a nest of wood shavings, lies a Nubbin.'),
            N('The note says: “One (1) Nubbin, quiet breed. Hand-raised. Do not overfeed.”'),
            N('Your Nubbins crowd round and poke it. It does not move. It does not blink. One of its eyes is a button.'),
            N('You take it back to the shop. Mr Fenwick Mull is polishing the counter, which is already very shiny.'),
            Y('This Nubbin you sent me doesn’t move.'),
            FM('Ah, no. That’s normal, for that breed.', 'think'),
            FM("It's resting."),
            Y('It has a seam down its back.'),
            FM('Lovely stitching, isn’t it? Hand-done. Very rare.', 'happy'),
          ],
          choices: [
            {
              id: 'refund',
              label: 'I want my Shells back.',
              then: [FM('A refund? We don’t do refunds. Never needed to. Nothing has ever gone wrong.', 'shock')],
            },
            {
              id: 'wait',
              label: 'Then I’ll wait for it to wake up.',
              set: { 'q12-waited': true },
              then: [N('You wait. Mr Fenwick Mull waits. The Nubbin waits harder than either of you.')],
            },
          ],
        },
        done: {
          id: 'q12-evidence',
          lines: [
            N('Evidence one: you offer it a heart fruit. It does not eat it. No Nubbin has ever turned down a heart fruit.'),
            N('Evidence two: you tickle its feet. Nothing. Your own Nubbin, watching, falls over giggling on its behalf.'),
            N('Evidence three: you set it in the pond. It floats face down, with great calm, and a price tag bobs up beside it.'),
          ],
        },
      },
      {
        id: 'q12-s2',
        goal: 'Win the argument with Mr Fenwick Mull.',
        hint: 'Present all three pieces of evidence at the counter, then hold your ground.',
        check: 'talk:fenwick:evidence-3',
        scene: {
          id: 'q12-argument',
          lines: [
            N('Back at the shop, you lay out the evidence on the shiny counter: one uneaten heart fruit, one damp Nubbin, one price tag.'),
            FM('Well. That’s shyness. Shy breed. It didn’t want to eat in front of you.', 'think'),
            Y('It didn’t laugh when I tickled it.'),
            FM('Tired from the journey. Long way from the warehouse. Er. The nest. The wild nest.'),
            Y('It floated face down in the pond.'),
            FM('Loves a swim. Very relaxed swimmer. Floats like a lily.', 'happy'),
            N('He gives the plush an encouraging pat. It topples slowly sideways off the counter.'),
            FM('Pining. Misses its nest. They pine, this breed. Terribly sensitive.', 'sad'),
            N('You pick up the price tag and hold it in front of his nose.'),
            Y('This is an ex-parrot.'),
            FM('That isn’t a parrot.'),
            Y('I know. I panicked. My point stands.'),
          ],
          choices: [
            {
              id: 'stare',
              label: 'Say nothing. Hold the stare.',
              set: { 'q12-stared': true },
              then: [N('You hold the stare. He holds it back. Somewhere a clock ticks. He blinks first.')],
            },
            {
              id: 'read-tag',
              label: 'Read the price tag aloud.',
              then: [Y('“Plush toy. Stuffed. Not alive. Made with love.”'), FM('…Made with love, though.', 'soft')],
            },
            {
              id: 'replace',
              label: 'Then I’ll have a replacement.',
              set: { 'q12-brother': true },
              then: [
                FM('Out of stock, sadly. But my brother has a shop over the ridge. Lovely man. Completely different.', 'happy'),
                N('You walk over the ridge. The shop is identical. Behind the counter, in a false moustache, stands Mr Fenwick Mull.'),
                FM('Fenwick’s brother. Never met him.', 'think'),
                N('The moustache falls off. He puts it back on, slightly higher. You walk back over the ridge together, in silence.'),
              ],
            },
          ],
        },
        done: {
          id: 'q12-crack',
          lines: [
            FM('All right. ALL RIGHT. It’s a toy. It’s always been a toy. I was told it was a Nubbin by a man who sold toys.', 'sad'),
            FM('I’ll give you your Shells back. I’ll even open a returns counter. First one in the valley.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q12-complete',
      lines: [
        N('Mr Fenwick Mull counts your Shells back into your hand. He looks lighter for it, somehow.'),
        FM('Keep the toy, though. No charge. It’s grown on me. In a way that isn’t growing.', 'soft'),
        N('You carry it home. Your Nubbins take it straight to the nest and pile round it.'),
        N('By evening they are fast asleep, cuddled up to the plush Nubbin, who is having a genuinely lovely rest.'),
        N('From now on the shop takes things back within a day. You needn’t explain, though Mr Fenwick Mull will ask, hopefully.'),
      ],
    },
    rewards: [
      {
        id: 'plush-nubbin',
        kind: 'decor',
        label: 'Plush Nubbin',
        description: 'A stuffed toy Nubbin with one button eye. Your Nubbins cuddle it when they nap nearby.',
      },
      {
        id: 'shop-refunds',
        kind: 'feature',
        label: 'Refunds',
        description: 'The shop now takes back items you have bought, for a full refund, if you return them within a day.',
      },
    ],
    childLines: {
      'q12-intro#6': 'It’s having a little nap.',
      'q12-argument#9': 'This toy has never been a Nubbin. Not once.',
      'q12-argument#10': '“Never” is a very strong word.',
      'q12-argument#11': 'It’s the right word. My point stands.',
    },
    notes:
      'The parcel arrives at the nest with a delivery jingle; the plush uses a Nubbin model with a stitched seam and one ' +
      'button eye, no animation at all. Evidence is gathered by three interactions with the plush (Feed, Tickle/Pet, drop ' +
      'in pond); each adds an evidence icon to the quest card, in any order. The price tag is a small floating prop. ' +
      'Refunds: a Return option in the shop for items bought within one in-game day, full price back. Approved quotes ' +
      '"It\'s resting." and "This is an ex-parrot." each used once; swapped in childLines, along with the two lines after ' +
      'the second quote so the Learning Grove version still reads properly.',
  },

  // ------------------------------------------------------------------ Q13
  {
    id: 'q13',
    code: 'Q13',
    title: 'Ministry of Silly Walks',
    source: 'Monty Python’s Flying Circus: the Ministry of Silly Walks',
    audience: 'all',
    trigger: { where: 'A small wooden booth at the crossroads', when: WHEN },
    speakers: [STRUTT],
    steps: [
      {
        id: 'q13-s1',
        goal: 'Show Mr Strutt a walk of your own.',
        hint: 'Tap a pattern of moves on the pad (up, down, left, right, spin), then press Walk.',
        check: 'minigame:silly-walk:any',
        scene: {
          id: 'q13-intro',
          lines: [
            N('A small wooden booth has appeared at the crossroads. The sign reads: GRANTS FOR WALKS (VERY SILLY ONLY).'),
            N('Behind the counter sits a tall Keeper in a bowler hat, stamping forms. He stamps each one twice, for luck.'),
            ST('Good morning. Hollis Strutt. I fund silly walks. Development, research, outreach.', 'think'),
            ST('Most walks in this valley are dreadfully sensible. It keeps me up at night.', 'sad'),
            N('He shows you his own walk to the filing cabinet. It takes four minutes and involves a sort of kick, a sort of sit, and a sort of question mark.'),
            ST('Now. Show me yours. Use the pad. Make up a pattern. Surprise me.'),
          ],
          choices: [
            {
              id: 'nervous',
              label: 'I’m not sure I have one.',
              then: [ST('Everyone has one. Most people keep it hidden. Such a waste.', 'sad')],
            },
            {
              id: 'eager',
              label: 'I’ve been practising.',
              set: { 'q13-practised': true },
              then: [ST('Marvellous. Don’t tell me. Show me.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q13-first',
          lines: [
            N('You perform your walk. It has a hop in it. You are quite proud of the hop.'),
            N('Mr Strutt watches over steepled fingers. He makes a single note. It is a small note.'),
            ST("It's not particularly silly, is it?"),
            ST('The hop is fine. The hop is a start. But the rest of you was just walking. With a hop on top.', 'sad'),
          ],
        },
      },
      {
        id: 'q13-s2',
        goal: 'Show Mr Strutt a properly silly walk.',
        hint: 'Longer patterns score higher. Mix in spins, backward steps and pauses; the same move twice in a row counts less.',
        check: 'minigame:silly-walk:score:silly',
        scene: {
          id: 'q13-notes',
          lines: [
            ST('Let me give you some notes.', 'think'),
            ST('Use more knee. Knees are underused in this valley. Then do something with your elbows that nobody asked for.'),
            ST('And at least once, go backwards for no reason, and look as if there was a reason.'),
            ST('This year the Ministry of Sensible Paths got forty times our budget. Forty. For gravel.', 'sad'),
            N('Your Nubbin has been watching all this. It tries the walk itself, falls over, and carries on lying down.'),
            ST('Now THAT is promising. Take notes from your Nubbin.', 'happy'),
            N('He slides a fresh form across the counter. It already has two stamps on it, for luck.'),
          ],
          choices: [
            {
              id: 'copy',
              label: 'Copy your Nubbin.',
              set: { 'q13-copied-nubbin': true },
              then: [N('You try walking lying down. It does not work, but it is very silly.')],
            },
            {
              id: 'own',
              label: 'Make it your own.',
              then: [ST('Bold. Original. I am already reaching for the stamp.')],
            },
          ],
        },
        done: {
          id: 'q13-approved',
          lines: [
            N('You walk. You hop, crouch, spin, go backwards with conviction, and finish with the elbows.'),
            N('Mr Strutt rises slowly to his feet. He removes his bowler hat and presses it to his chest.'),
            ST('That is the silliest thing I have seen since Tuesday. Approved.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q13-complete',
      lines: [
        N('He stamps your form twice. Then a third time. He has never stamped a third time before.'),
        ST('Your grant is approved. Use it well. Walk silly, often, and in public.', 'happy'),
        N('He hands you a spare bowler hat from under the counter. It is slightly too big and absolutely perfect.'),
        ST('You may switch the walk on and off as you please. I would leave it on. But then I would.'),
        ST('Between you and me, nobody needs a grant to be silly. But people do seem to want a form that says they may.', 'soft'),
        N('Your Keeper can now walk silly whenever you like. Toggle it in the settings.'),
      ],
    },
    rewards: [
      {
        id: 'silly-walk-gait',
        kind: 'feature',
        label: 'Silly Walk',
        description: 'A silly-walk gait for your Keeper, built from the pattern you showed Mr Strutt. Switch it on and off in settings.',
      },
      {
        id: 'bowler-hat',
        kind: 'cosmetic',
        label: 'Bowler Hat',
        description: 'A slightly-too-big bowler hat, as worn by the valley’s only funder of silly walks.',
      },
    ],
    childLines: {
      'q13-first#2': 'Hmm. That’s rather ordinary, isn’t it?',
    },
    notes:
      'The pad accepts up to 12 moves (up, down, left, right, spin, pause) on keys or joystick; the first attempt always gets ' +
      'the "not silly" response, whatever the score. Scoring for step 2: length, variety, backwards steps and pauses add; ' +
      'repeats subtract; "silly" is any score above a modest threshold so nobody gets stuck. The winning pattern is saved ' +
      'and becomes the Keeper’s silly-walk gait (procedural: legs and elbows follow the pattern loop). Mr Strutt’s own walk ' +
      'to the cabinet is a long, unhurried animation. Approved quote "It\'s not particularly silly, is it?" used once; ' +
      'swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q14
  {
    id: 'q14',
    code: 'Q14',
    title: 'The Comfy Chair',
    source: 'Monty Python’s Flying Circus: the Spanish Inquisition',
    audience: 'all',
    trigger: { where: 'Your nest; they burst in through the gate', when: WHEN + ', when at least one Nubbin is tired' },
    speakers: [POUFFE, BOLSTER, TUFT],
    steps: [
      {
        id: 'q14-s1',
        goal: 'Fetch the comfy chair from the Workshop.',
        hint: 'It is the big red armchair by the Workshop door. Pick it up and carry it to the nest.',
        check: 'carry:decor:comfy-chair:nest',
        scene: {
          id: 'q14-intro',
          lines: [
            N('You are quietly brushing a Nubbin by the nest when the gate bangs open.'),
            N('Three Keepers in long red robes sweep in. One trips on the step. They sweep in again, more carefully.'),
            PO('Nobody expects the Spanish Inquisition!', 'angry'),
            N('There is a long silence. Your Nubbin, mid-brush, stares at them.'),
            Y('We… really didn’t.'),
            PO('Precisely! Surprise is our main tool. Surprise and cushions. Our two tools are surprise, cushions—', 'happy'),
            BO('And blankets.'),
            PO('Our THREE tools are… no. Hang on. We shall go out and come in again.', 'think'),
            N('They go out. The gate bangs open. They sweep in, nobody trips, and Brother Bolster raises two plump cushions, menacingly.'),
            BO('Soft. Very soft. You have been warned.', 'think'),
            PO('Your Nubbins look tired. Overworked. Under-napped. We shall see to that. Sister Tuft!'),
            PO('Fetch… the comfy chair!', 'angry'),
            TF('We left it at your Workshop. Brother Pouffe said he’d carry it.', 'sad'),
            PO('…Keeper. Would you be so good as to fetch the comfy chair?', 'sad'),
          ],
          choices: [
            {
              id: 'fetch',
              label: 'Fine. I’ll fetch it.',
              then: [PO('Splendid. We shall wait here, being terrifying.', 'happy')],
            },
            {
              id: 'cushion',
              label: 'Can I hold a cushion?',
              set: { 'q14-held-cushion': true },
              then: [BO('…Just for a minute.', 'soft'), N('It is extremely soft. You can see why he is proud of it.')],
            },
          ],
        },
        done: {
          id: 'q14-chair',
          lines: [
            N('You set the chair down by the nest. It is deep, red and squashy, with a fringe round the bottom.'),
            TF('Behold. The comfy chair.', 'happy'),
            N('Brother Pouffe cracks his knuckles. Brother Bolster raises the cushions. Sister Tuft fluffs the chair, twice.'),
          ],
        },
      },
      {
        id: 'q14-s2',
        goal: 'Put your most tired Nubbin in the comfy chair.',
        hint: 'Tiredness shows on a Nubbin’s status card. Pick up the sleepiest one and drop it on the chair.',
        check: 'place:nubbin:comfy-chair:tired',
        scene: {
          id: 'q14-sentence',
          lines: [
            PO('Now. Bring us your most tired Nubbin.', 'angry'),
            PO('It shall sit in the comfy chair until lunchtime. With a cushion behind it. And another cushion. Beside.'),
            BO('And a blanket over its knees. A woolly one.', 'think'),
            TF('And no getting up. Not even for a snack.'),
            PO('Unless it is a very small snack.'),
            N('They exchange grim nods. They have done this many times, and it always goes exactly to plan.'),
          ],
          choices: [
            {
              id: 'sleepiest',
              label: 'Bring the sleepiest Nubbin.',
              then: [N('Your sleepiest Nubbin yawns so wide it nearly falls into itself.')],
            },
            {
              id: 'volunteer',
              label: 'Offer to sit in the chair yourself.',
              set: { 'q14-volunteered': true },
              then: [PO('Ha! Keepers are not under investigation today. Bring us a Nubbin.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q14-asleep',
          lines: [
            N('The Nubbin sinks into the chair. Bolster tucks in a cushion. Tuft lays a blanket over its knees.'),
            N('It is asleep before the blanket lands. It snores very softly, like a kettle thinking about it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q14-complete',
      lines: [
        N('Two hours later, the Nubbin wakes. It stretches. It glows. It looks as if it has slept for a week.'),
        PO('Ha! Look at it. Utterly refreshed. Our work here is done.', 'happy'),
        BO('Best nap we have ever given. Possibly the best nap anyone has ever had.', 'soft'),
        TF('We should go. We have three more Groves to burst into before tea.'),
        N('They sweep out. One trips on the step. Then they sweep back in, because they forgot the chair.'),
        PO('Keep it. We have another. We have a whole room of them.', 'think'),
        PO('One last question, Keeper. When did YOU last sit down?', 'think'),
        N('From now on, a tired Nubbin on the comfy chair naps back to full twice as fast.'),
      ],
      choices: [
        {
          id: 'sit',
          label: 'Sit in the chair, just for a minute.',
          set: { 'q14-keeper-napped': true },
          then: [
            N('You sit. Sister Tuft tucks a blanket over your knees. You wake an hour later with a cushion on your face and no idea what day it is.'),
            PO('Ha! Another one broken. Our work is never done.', 'happy'),
          ],
        },
        {
          id: 'busy',
          label: 'No time. There’s too much to do.',
          then: [
            TF('That is what they all say.', 'sad'),
            PO('Keep the chair, then. It will wait for you. Chairs are very good at waiting.', 'think'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'comfy-chair',
        kind: 'decor',
        label: 'The Comfy Chair',
        description: 'A deep, red, squashy armchair with a fringe. Tired Nubbins who nap on it recover twice as fast.',
      },
    ],
    childLines: {
      'q14-intro#2': 'Nobody expects the Nap Patrol!',
      'q14-intro#11': 'Bring… the comfy chair!',
    },
    notes:
      'A dramatic entrance: a sting chord as the gate bangs open, cut short when one of them trips, then replayed. The red ' +
      'robes are plain and cosy, with no religious symbols. The chair appears outside the Workshop when the quest starts. ' +
      'The "two hours later" in the complete scene is a quick fade, not real time. Nap rate on the chair: double the normal ' +
      'tiredness recovery while asleep on it. Approved quotes "Nobody expects the Spanish Inquisition!" and ' +
      '"Fetch… the comfy chair!" each used once; both swapped in childLines. ' +
      'The re-entrance in the intro replays the gate bang and sting, this time without the trip. The complete-scene choice to sit sets q14-keeper-napped (a quick fade, cosmetic).',
  },

  // ------------------------------------------------------------------ Q15
  {
    id: 'q15',
    code: 'Q15',
    title: 'The Fruitless Fruit Stall',
    source: 'Monty Python’s Flying Circus: the Cheese Shop',
    audience: 'all',
    trigger: { where: 'A smart green stall by the bridge', when: WHEN },
    speakers: [DIBBLE],
    steps: [
      {
        id: 'q15-s1',
        goal: 'Ask Mr Dibble for six different fruits.',
        hint: 'Pick a fruit from the order list at the stall. Each fruit counts once.',
        check: 'ask:dibble:fruit:6',
        scene: {
          id: 'q15-intro',
          lines: [
            N('A smart green stall has opened by the bridge. The sign says DIBBLE’S: EVERY FRUIT IN THE VALLEY, AND THEN SOME.'),
            N('Behind it stands Mr Pomeroy Dibble, in a striped apron and a straw boater, beaming.'),
            DB('Good morning! Whatever fruit you fancy, we have it. Every fruit in the valley. Possibly more.', 'happy'),
            N('The crates behind him are covered with cloths. Neat, clean, suspiciously flat cloths.'),
            Y('A run fruit, please.'),
            DB('Ah. Run fruit. Just out, I’m afraid. There was a rush on them. They ran.', 'sad'),
            Y('A swim fruit, then.'),
            DB('Swim fruit! Normally, yes. Today, sadly, the delivery Nubbin went for a swim, and so did the fruit.'),
          ],
          choices: [
            {
              id: 'polite',
              label: 'Keep asking politely.',
              then: [DB('Please do! Asking is half the fun. For me.', 'happy')],
            },
            {
              id: 'peek',
              label: 'Lift a cloth.',
              set: { 'q15-peeked': true },
              then: [
                N('Mr Dibble lowers the cloth again, gently, with one finger.'),
                DB('Let’s not spoil the surprise.'),
              ],
            },
          ],
        },
        done: {
          id: 'q15-six',
          lines: [
            Y('Fly fruit?'),
            DB('Flew.'),
            Y('Power fruit? Stamina fruit? Sun fruit?'),
            DB('Lifted, by a strong Nubbin. Eaten, by a tired one. And the sun fruit set. They do that.', 'sad'),
          ],
        },
      },
      {
        id: 'q15-s2',
        goal: 'Keep asking until you have tried all twelve fruits.',
        hint: 'Keep choosing from the order list. Something gives at twelve.',
        check: 'ask:dibble:fruit:12',
        scene: {
          id: 'q15-twelve',
          lines: [
            N('You keep going. Mr Dibble keeps smiling. It is a smile that has had a great deal of practice.'),
            N('Somewhere behind the stall, a Nubbin is plucking a tiny mandolin. Slowly. The same three notes.'),
            Y('Moon fruit?'),
            DB('Only at night. And at night I’m closed.'),
            Y('Heart fruit?'),
            DB('A Nubbin looked at it with such love that I hadn’t the heart. Gave it away.', 'soft'),
            Y('A coconut. Just one coconut.'),
            DB('There is one palm in the whole valley, and frankly it has had a difficult week.', 'think'),
            Y('Could the music stop?'),
            DB('Stop? It’s the atmosphere.', 'shock'),
            N('The Nubbin plays the three notes again, more slowly, out of spite.'),
          ],
        },
        done: {
          id: 'q15-confess',
          lines: [
            N('By the twelfth fruit, Mr Dibble has stopped smiling. He takes off his boater and holds it in both hands.'),
            DB('I have a confession. There has never been any fruit. Not a single pip. I just liked the stall.', 'sad'),
            Y("Not much of a cheese shop, is it?"),
            DB('It’s a fruit stall.'),
            Y('Not much of one of those, either.'),
          ],
          choices: [
            {
              id: 'stock',
              label: 'Let’s stock it. With real fruit.',
              set: { 'q15-stocked': true },
              then: [
                DB('Real fruit? But then people would buy it. And then it would be gone.', 'shock'),
                DB('…I’ll put out one run fruit. On a cushion. Facing the wall, so it doesn’t get ideas.', 'soft'),
              ],
            },
            {
              id: 'leave-it',
              label: 'Don’t change a thing.',
              set: { 'q15-stocked': false },
              then: [
                DB('Really? You don’t mind?', 'soft'),
                Y('It’s the friendliest stall in the valley. It just isn’t a shop.'),
                DB('That is the nicest thing anyone has ever said to me over an empty crate.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q15-complete',
      lines: [
        DB('You’re right. You’re quite right. But I’ll tell you what I do have. Knowledge.', 'think'),
        N('From under the counter he brings out a thick, beautifully drawn page: every fruit in the valley, with notes on each.'),
        DB('Where it grows. What it does. Which Nubbins like it best. I know everything about fruit except where to get any.'),
        N('He slips it into your Collection book. It fits perfectly, as if there was always a gap for it.'),
        DB('And the boater. Take it. It belongs on someone with fruit.', 'soft'),
        N('As you leave, you hear him greet the next customer with great cheer: “Just out, I’m afraid!”'),
      ],
    },
    rewards: [
      {
        id: 'fruit-catalogue',
        kind: 'feature',
        label: 'Fruit Catalogue',
        description: 'A new page in your Collection book listing every fruit in the valley, where it grows and what it does.',
      },
      {
        id: 'straw-boater',
        kind: 'cosmetic',
        label: 'Straw Boater',
        description: 'Mr Dibble’s straw boater, with a striped band. Belongs on someone with fruit.',
      },
    ],
    childLines: {
      'q15-confess#2': 'Not much of a fruit stall, is it?',
      'q15-confess#3': 'It’s a very good stall. It just hasn’t got any fruit.',
      'q15-confess#4': 'That is the main thing a fruit stall needs.',
    },
    notes:
      'The order list offers twelve fruits: run, swim, fly, power, stamina, sun, moon, heart, coconut, and three more of the ' +
      'implementer’s choice from the crop list. Each one gets a one-line excuse from Mr Dibble (write the remaining excuses ' +
      'in the same deadpan style: the fruit always did the thing its name suggests). Step 1 completes at six asked, step 2 ' +
      'at twelve, in any order. The catalogue page fills in automatically and updates as new fruits are added. Approved ' +
      'quote "Not much of a cheese shop, is it?" used once; swapped in childLines, along with the two lines after it.',
  },

  // ------------------------------------------------------------------ Q16
  {
    id: 'q16',
    code: 'Q16',
    title: 'The Argument Booth',
    source: 'Monty Python’s Flying Circus: the Argument Clinic',
    audience: 'all',
    trigger: { where: 'Byte’s booth outside the Workshop', when: WHEN },
    speakers: [BYTE, PIXEL],
    steps: [
      {
        id: 'q16-s1',
        goal: 'Pay Byte 5 Shells for an argument.',
        hint: 'Tap Byte’s booth and choose Pay. You need 5 Shells.',
        check: 'pay:shells:5:byte',
        scene: {
          id: 'q16-intro',
          lines: [
            N('Byte has set up a booth outside the Workshop. The sign says: ARGUMENTS. 5 SHELLS. ONE MINUTE EXACTLY.'),
            N('There is a sand timer on the counter. Byte is looking at it the way other people look at cake.'),
            N('Next to it stands a smaller booth marked COMPLAINTS. It is also Byte, in a different hat.'),
            BY('Good afternoon. Would you like an argument?', 'think'),
            Y('What sort of argument?'),
            BY('The best sort. A structured exchange of reasoned positions, timed for fairness.'),
            BY('It is five Shells. Please pay first. I find arguments about payment unpleasant.'),
          ],
          choices: [
            {
              id: 'pay',
              label: 'Pay the five Shells.',
              then: [BY('Thank you. Your minute begins when you sit down.', 'happy')],
            },
            {
              id: 'four',
              label: 'Four Shells?',
              set: { 'q16-haggled': true },
              then: [BY('No. That one was free. Please do not do it again.', 'think')],
            },
          ],
        },
        done: {
          id: 'q16-flip',
          lines: [
            N('Byte turns the sand timer over with great ceremony. The sand begins to run.'),
            BY('Your minute has begun. Please begin.'),
          ],
        },
      },
      {
        id: 'q16-s2',
        goal: 'Win the argument before the sand runs out.',
        hint: 'Pick your replies carefully. Arguing back only feeds him; point out what he is actually doing.',
        check: 'minigame:argue:byte:win',
        scene: {
          id: 'q16-minute',
          lines: [
            Y('Your booth is very nice.'),
            BY('Disagree.'),
            Y('It’s a lovely day for it.'),
            BY('False. It is a mediocre day.'),
            Y('It’s sunny. There’s a rainbow.'),
            BY('That is a smudge.', 'think'),
            N('Your Nubbin, on the stool beside you, looks from Byte to the window, then back to Byte.'),
            Y('You’re just disagreeing with everything I say.'),
            BY('Incorrect.'),
            N('The sand is half gone.'),
          ],
          choices: [
            {
              id: 'agree',
              label: 'Agree with Byte, to see what happens.',
              set: { 'q16-agreed': true },
              then: [Y('You’re right. It’s a smudge.'), BY('It is clearly a rainbow.', 'angry')],
            },
            {
              id: 'breathe',
              label: 'Take a breath.',
              then: [N('You take a breath. Byte takes one too, in case that was a point.')],
            },
          ],
        },
        done: {
          id: 'q16-win',
          lines: [
            Y("This isn't an argument."),
            BY('It is.'),
            Y("An argument isn't just contradiction."),
            N('Byte opens his mouth to disagree. Then he stops, and looks at the sand timer for help.'),
            BY('…That is a fair point.', 'shock'),
          ],
          choices: [
            {
              id: 'complain',
              label: 'Take it up with Complaints.',
              set: { 'q16-complained': true },
              then: [
                N('You step next door. Byte swaps hats and steps next door too.'),
                BY('Complaints. Go on.', 'think'),
                Y('The argument man just kept contradicting me.'),
                BY('Did he. I shall have a word with him.', 'angry'),
                N('He swaps hats, turns to face the empty stool, and has a long, stern word with himself.'),
              ],
            },
            {
              id: 'shake',
              label: 'Shake hands. Good game.',
              then: [BY('It was not a game. It was a— yes. Fine. Good game.', 'soft')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q16-complete',
      lines: [
        N('The last grain of sand drops. Byte stares at it for a long moment.'),
        BY('Nobody has ever won before. Most people just get cross until the sand runs out.', 'think'),
        BY('Disagreeing is easy. I have been doing it for years and calling it thinking.', 'soft'),
        BY('You may keep the timer. I will make another. I have a great deal of sand.'),
        BY('And I am putting you on the board. Debate Club. Founding member. There are no other members.', 'happy'),
        Y('Is there a club?'),
        BY('There is now. Do not argue.'),
        N('Pixel leans out of the Workshop window with a spanner.'),
        PX('Did you win? Nobody wins. I’ve been married to the man in that booth for twenty years.', 'happy'),
        BY('Disagree.'),
        PX('See?'),
      ],
    },
    rewards: [
      {
        id: 'sand-timer',
        kind: 'decor',
        label: 'Sand Timer',
        description: 'Byte’s one-minute argument timer. Tap it to turn it over; it runs for exactly one minute.',
      },
      {
        id: 'debate-club',
        kind: 'title',
        label: 'Debate Club',
        description: 'A title for your Keeper profile: founding (and only) member of Byte’s Debate Club.',
      },
    ],
    childLines: {
      'q16-win#0': 'Hang on. You’re not giving any reasons.',
      'q16-win#2': 'Saying the opposite isn’t the same as explaining why.',
    },
    notes:
      'Costs exactly 5 Shells; if the player cannot pay, Byte says the booth will be here and the quest waits. Step 2 is a ' +
      'one-minute reply minigame: a few reply cards each turn; every ordinary reply gets contradicted, and one card each ' +
      'round is "point out what he is doing". Picking it wins. If the sand runs out first, Byte offers another minute for ' +
      'free ("I was enjoying that"). Approved quotes "This isn\'t an argument." and "An argument isn\'t just ' +
      'contradiction." each used once; both swapped in childLines. ' +
      'The COMPLAINTS booth is a second, smaller booth prop beside the first; Byte swaps between two hats (one per booth).',
  },

  // ------------------------------------------------------------------ Q17
  {
    id: 'q17',
    code: 'Q17',
    title: 'The Fish-Slapping Dance',
    source: 'Monty Python’s Flying Circus: The Fish-Slapping Dance',
    audience: 'all',
    trigger: { where: 'The end of the dock on the pond', when: WHEN },
    speakers: [PILCHARD, GRAMPUS],
    steps: [
      {
        id: 'q17-s1',
        goal: 'Learn the steps of the dock dance.',
        hint: 'Open Karate on the dock. Tap in time with the beat markers; the fish does the rest.',
        check: 'karate:practice:dock-dance',
        scene: {
          id: 'q17-intro',
          lines: [
            N('On the end of the dock, two Keepers in crisp white shirts and sun hats stand very straight.'),
            N('Each holds a small, shiny fish. They hold them the way other people hold violins.'),
            PI('Good morning. Pilchard. This is Grampus. We are a dance society.', 'think'),
            GR('Of two.'),
            PI('We perform the old dance of the dock. It is very formal. We have an opening for a third.'),
            GR('The last third went in.', 'think'),
            N('Mr Pilchard demonstrates: a small step, a bow, and a gentle, rhythmic tap on Mr Grampus’s cheek with the fish.'),
            N('Mr Grampus does it back. They both bow. Neither smiles. It is beautiful, in a confusing way.'),
            GR('Will you dance?'),
          ],
          choices: [
            {
              id: 'honoured',
              label: 'I’d be honoured.',
              then: [PI('Splendid. You will need a fish.', 'happy')],
            },
            {
              id: 'fish-mind',
              label: 'Do the fish mind?',
              set: { 'q17-asked-fish': true },
              then: [GR('The fish were consulted. The fish are dancers too.', 'soft')],
            },
          ],
        },
        done: {
          id: 'q17-learned',
          lines: [
            N('Step, bow, tap. Step, bow, tap. Your fish is a sprat. It does its best.'),
            PI('Good. Very good. The wrist is a little eager.', 'think'),
            GR('Eager wrists end up in the water.'),
          ],
        },
      },
      {
        id: 'q17-s2',
        goal: 'Dance the full performance on the dock.',
        hint: 'It is a timing bout on the karate screen. Hit every beat; the last beat is not yours to win.',
        check: 'karate:win:dock-dance:timing',
        scene: {
          id: 'q17-performance',
          lines: [
            PI('Now. The full performance. In front of the whole pond.', 'happy'),
            N('A small audience of Nubbins has gathered on the bank. One has brought a snack.'),
            GR('Keep the timing. Whatever happens, keep the timing.'),
            N('Mr Grampus reaches behind a crate and brings out a second fish. It is much, much bigger: a herring the length of a draught excluder.'),
            Y('That’s not the same fish.'),
            GR('It is the finale fish.', 'think'),
          ],
          choices: [
            {
              id: 'keep-time',
              label: 'Keep the timing.',
              set: { 'q17-kept-time': true },
              then: [N('You set your feet. Your sprat trembles.')],
            },
            {
              id: 'ask-finale',
              label: 'Ask what the finale involves.',
              then: [PI('Water, mostly.'), GR('Gently, though. We are not savages.')],
            },
          ],
        },
        done: {
          id: 'q17-splash',
          lines: [
            N('Step, bow, tap. Step, bow, tap. Perfect timing, every beat.'),
            N('Then Mr Grampus swings the finale fish, very slowly and very gently, and you topple off the dock into the pond.'),
            N('It is warm. A duck looks at you. The Nubbins on the bank cheer as if this was the plan. It was.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q17-complete',
      lines: [
        N('You climb out. Mr Pilchard hands you a towel. Mr Grampus hands you the finale fish.'),
        GR('Traditional. The one who goes in keeps the herring.', 'soft'),
        PI('It is excellent for knocking fruit out of trees from a distance. Give it to your strongest Nubbin.'),
        PI('And you may keep the bow. It suits you.', 'happy'),
        GR('We dance it every morning. Usually for nobody. It is nice to be watched, though we would do it anyway.', 'soft'),
        N('Your Power Nubbins can now use the herring to knock fruit down from afar, and you have a new fish-slap victory pose in karate.'),
      ],
    },
    rewards: [
      {
        id: 'herring',
        kind: 'item',
        label: 'Herring',
        description: 'The finale fish. Give it to a Power Nubbin and it can knock fruit off a tree from a distance.',
      },
      {
        id: 'fish-slap-pose',
        kind: 'cosmetic',
        label: 'Fish-Slap Victory Pose',
        description: 'A new karate victory pose: a formal bow and a gentle tap with a small fish.',
      },
    ],
    notes:
      'No source quotes; the original is wordless, so all lines are new. Staging: two Keepers on the dock end, white shirts, ' +
      'sun hats, very upright posture. Step 1 is a practice timing track; step 2 a full timing bout on the karate screen ' +
      'with a jaunty original march (new music, nothing borrowed). The last beat always ends with the player knocked gently ' +
      'into the pond regardless of score: slow-motion swing, soft splash, a duck. No damage, no happiness loss. The herring ' +
      'lets a Power Nubbin shake a tree from about five tiles away. ' +
      'Mr Grampus’s line about the last third is the only hint of the finale; play it deadpan, no pause.',
  },

  // ------------------------------------------------------------------ Q18
  {
    id: 'q18',
    code: 'Q18',
    title: 'Self-Defence Against Fresh Fruit',
    source: 'Monty Python’s Flying Circus: Self-Defence Against Fresh Fruit',
    audience: 'all',
    trigger: { where: 'The clearing in the woods, where a row of logs has been set out', when: WHEN },
    speakers: [GRIMBLE],
    steps: [
      {
        id: 'q18-s1',
        goal: 'Disarm the Nubbin with the banana.',
        hint: 'When the Nubbin swings the banana, tap Peel at the top of the swing.',
        check: 'class:fruit-defence:banana',
        scene: {
          id: 'q18-intro',
          lines: [
            N('In the clearing, a Keeper with a moustache like a yard brush is pacing in front of a row of logs.'),
            N('Three Nubbins sit on the logs. They look as if they were here first and have been told off for it.'),
            SG('YOU! Late! Sit! On a log!', 'angry'),
            SG('Sergeant Grimble. Tonight’s class: defending yourself against a person armed with fresh fruit.'),
            SG('Dried fruit is next week. Dried fruit is a whole different animal.', 'think'),
            N('A Nubbin on the end log raises a paw.'),
            SG('NO. Not sticks. Every class wants sticks. Tonight is FRUIT.', 'angry'),
            N('The Nubbin lowers its paw very slowly. It was going to ask about sticks.'),
            SG('First. The banana. Somebody comes at you with a banana. What do you do?'),
          ],
          choices: [
            {
              id: 'duck',
              label: 'Duck.',
              then: [SG('DUCK? A banana CURVES, Keeper. It will find you.', 'angry')],
            },
            {
              id: 'reason',
              label: 'Talk them down.',
              then: [SG('With a BANANA in their hand? They are beyond reason!', 'angry')],
            },
            {
              id: 'peel',
              label: 'Peel it.',
              set: { 'q18-knew-peel': true },
              then: [SG('…Correct. Who told you? Nobody ever knows that.', 'shock')],
            },
          ],
        },
        done: {
          id: 'q18-banana',
          lines: [
            N('A Nubbin lunges at you with a banana. You peel it in one smooth move.'),
            N('The Nubbin stares at the naked banana, deeply embarrassed, and sits back down on its log.'),
            SG('TEXTBOOK! A peeled banana is a disgraced banana!', 'happy'),
          ],
        },
      },
      {
        id: 'q18-s2',
        goal: 'Catch every raspberry in the bowl.',
        hint: 'Slide the bowl left and right under the falling raspberries. Missing three restarts the drill.',
        check: 'class:fruit-defence:raspberry',
        scene: {
          id: 'q18-raspberry',
          lines: [
            SG('Next. The raspberry. Small. Fast. Underestimated. The raspberry is a professional.', 'think'),
            SG('It does not come alone. Where there is one raspberry, there are forty.'),
            N('A Nubbin rises from its log holding a bowl of raspberries, eyes narrowed.'),
            SG('Your defence against the raspberry is a bowl. Hold out a bowl. Catch them all. Leave none on the floor.'),
            Y('Why can’t any land on the floor?'),
            SG('Because they STAIN, Keeper. Do you want your floor to remember this?', 'angry'),
          ],
        },
        done: {
          id: 'q18-raspberry-done',
          lines: [
            N('Forty raspberries. Forty catches. Your bowl is full and the floor is spotless.'),
            N('The Nubbin with the empty bowl looks at its paws, then at yours, then quietly eats one of yours.'),
            SG('Acceptable. Move on.'),
          ],
        },
      },
      {
        id: 'q18-s3',
        goal: 'Toss the pineapple to your Nubbin from across the clearing.',
        hint: 'Hold the pineapple, aim at your Nubbin and tap Throw. Your Nubbin will run to meet it.',
        check: 'class:fruit-defence:pineapple',
        scene: {
          id: 'q18-pineapple',
          lines: [
            SG('And now. The big one.', 'think'),
            N('He lifts the cloth off a crate. In it sits a whole pineapple, prickly and enormous, wearing a small pair of sunglasses.'),
            SG('The pineapple. Spiky. Heavy. Thinks it’s better than you. It may be right.'),
            SG('Nobody defends against the pineapple. You can only teach it to be on your side.'),
            Y('How?'),
            SG('Throw it. Gently. To your Nubbin. Let your Nubbin catch it, and you have an ally.', 'happy'),
          ],
          choices: [
            {
              id: 'toss',
              label: 'Just toss it.',
              then: [SG('No ceremony. I like it.')],
            },
            {
              id: 'sunglasses',
              label: 'Take its sunglasses off first.',
              set: { 'q18-sunglasses-off': true },
              then: [SG('Bold. Very bold. It respects that.', 'shock')],
            },
          ],
        },
        done: {
          id: 'q18-catch',
          lines: [
            N('You toss the pineapple. Your Nubbin runs, jumps, and catches it in both arms with a soft “oof”.'),
            N('It holds the pineapple up like a trophy. The pineapple seems content with the arrangement.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q18-complete',
      lines: [
        SG('CLASS DISMISSED!', 'happy'),
        SG('You are now qualified to defend yourself against fresh fruit. And, more importantly, to throw it.'),
        SG('Between you and me, Keeper? Forty years, and not once has anybody attacked me with fruit.', 'soft'),
        SG('I have been ready the entire time. It has been exhausting.', 'think'),
        N('He presses a battered brass whistle into your hand. It has clearly been blown a great deal.'),
        SG('Blow that, and your Nubbins will look up. Throw, and they will catch. Any fruit. Any distance.'),
        SG('Except dried fruit. Next week. Bring a hat.', 'think'),
        N('From now on, your Nubbins can catch fruit you toss to them from a distance.'),
      ],
    },
    rewards: [
      {
        id: 'fruit-catch',
        kind: 'feature',
        label: 'Catch',
        description: 'Toss a fruit towards one of your Nubbins from a distance and it will run and catch it.',
      },
      {
        id: 'sergeant-whistle',
        kind: 'cosmetic',
        label: 'Sergeant’s Whistle',
        description: 'A battered brass whistle on a cord. Worn round the neck; blowing it makes nearby Nubbins look up.',
      },
    ],
    notes:
      'No source quotes; all lines are new. Three short drills: banana (a timing tap), raspberry (a catch-the-falling-fruit ' +
      'minigame, forty raspberries, three misses restarts), pineapple (an aimed throw to your own Nubbin). The class Nubbins ' +
      'are wild extras who sit on the logs between drills. Nobody is hit by fruit; the banana Nubbin only swings. Keep the ' +
      'sergeant loud but kind: he shouts, then praises. The pineapple’s sunglasses can be a cosmetic on the pineapple prop ' +
      'only. Catch reuses the existing throw: fruit thrown within range of a Nubbin that is facing you is caught.',
  },

  // ------------------------------------------------------------------ Q19
  {
    id: 'q19',
    code: 'Q19',
    title: 'Upper-Class Twit of the Year',
    source: 'Monty Python’s Flying Circus: Upper-Class Twit of the Year',
    audience: 'all',
    trigger: { where: 'The meadow, under a banner', when: WHEN },
    speakers: [THACKERY, BUNTY, PIERS, ALGERNON],
    steps: [
      {
        id: 'q19-s1',
        goal: 'Enter the Grand Toffs’ Cup in the meadow.',
        hint: 'Sign the entry book on Mrs Thackery’s table.',
        check: 'enter:race:toffs-cup',
        scene: {
          id: 'q19-intro',
          lines: [
            N('A banner over the meadow reads: THE GRAND TOFFS’ CUP. ENTRANTS WELCOME. NO EXPERIENCE NECESSARY, OR WANTED.'),
            MT('Roll up! The obstacle race! Three gentlemen entrants so far. We could do with a fourth.', 'happy'),
            N('The three gentlemen entrants are standing on the start line. One of them is facing the wrong way.'),
            BU('I say. Is this the start or the end? It looks awfully like the start.', 'think'),
            PR('It’s the middle, Bunty. Everything is the middle, if you think about it.'),
            AL('I have entered every year for nine years. I have never once found the start line. This is tremendously exciting.', 'happy'),
          ],
          choices: [
            {
              id: 'enter',
              label: 'Sign up.',
              then: [MT('Splendid! Pop your name in the book. Spell it however you like.')],
            },
            {
              id: 'turn-bunty',
              label: 'Turn Bunty round first.',
              set: { 'q19-turned-bunty': true },
              then: [N('You turn Bunty round. Bunty thanks you warmly, then turns back round, to be polite.')],
            },
          ],
        },
        done: {
          id: 'q19-ready',
          lines: [
            MT('Four entrants! Record turnout! The course: one row of matchboxes, one low wall, one sleeping Keeper. Mind the Keeper.'),
            N('At the far end of the course, a Keeper is snoring in a deckchair. Nobody knows who put them there.'),
          ],
        },
      },
      {
        id: 'q19-s2',
        goal: 'Win the Grand Toffs’ Cup.',
        hint: 'Run the course. Jump the matchboxes and step round the sleeping Keeper. Do not wake them; it takes ages.',
        check: 'race:win:toffs-cup',
        scene: {
          id: 'q19-race',
          lines: [
            MT('On your marks! Get set!', 'happy'),
            N('A whistle blows. You run. Behind you, nobody else moves.'),
            MT('And the Keeper is away! Bunty is checking which way is forward. Piers is tying his shoelace. To Algernon’s shoelace.', 'shock'),
            N('At the matchboxes, Piers finally arrives and leaps each one with enormous effort, about a foot too high.'),
            AL('I’ve found the start line! Hello, start line!', 'happy'),
            N('Bunty reaches the sleeping Keeper, stops, and taps them gently on the shoulder.'),
            BU('Frightfully sorry. Would you like to come? It’s ever so jolly.'),
          ],
          choices: [
            {
              id: 'straight-face',
              label: 'Keep a straight face and run.',
              set: { 'q19-straight-face': true },
              then: [N('You keep a perfectly straight face. It is the hardest thing you have ever done.')],
            },
            {
              id: 'laugh',
              label: 'Laugh all the way to the finish.',
              then: [N('You laugh so hard you have to walk the last stretch. You are still miles ahead.')],
            },
          ],
        },
        done: {
          id: 'q19-win',
          lines: [
            MT('The Keeper wins! By a margin of… well. By everybody.', 'happy'),
            N('Far behind, Algernon is waving goodbye to the start line as if seeing off a ship.'),
            N('Bunty finishes last, having walked the whole course arm in arm with the sleeping Keeper, who is still asleep.'),
          ],
          choices: [
            {
              id: 'bunty-prize',
              label: 'Bunty should get a prize for stopping to help.',
              set: { 'q19-bunty-prize': true },
              then: [
                MT('There isn’t a prize for that.', 'think'),
                Y('There should be.'),
                MT('…There is now. It’s a slightly smaller hat.', 'happy'),
                N('Bunty accepts it with tears in both eyes, and puts it on the sleeping Keeper.'),
              ],
            },
            {
              id: 'gracious',
              label: 'Accept graciously.',
              then: [N('You bow. Piers bows back. Algernon bows to the start line, which he has grown very fond of.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q19-complete',
      lines: [
        N('The three gentlemen gather to congratulate you. Two of them congratulate a fence post first.'),
        PR('Jolly well run. Frightfully fast. We had no idea people could go in that direction.', 'happy'),
        BU('Here. The prize. It’s a top hat. And the monocle’s from me. I’ve two more. I can’t find either.'),
        N('The hat is tall and glossy. The monocle stays in only if you raise one eyebrow, permanently.'),
        AL('Same time next year? I shall start looking for the start line tonight.', 'happy'),
        N('The sleeping Keeper wakes, sees you in the top hat, and goes straight back to sleep.'),
      ],
    },
    rewards: [
      {
        id: 'top-hat',
        kind: 'cosmetic',
        label: 'Top Hat',
        description: 'A tall, glossy top hat. First prize in the Grand Toffs’ Cup.',
      },
      {
        id: 'monocle',
        kind: 'cosmetic',
        label: 'Monocle',
        description: 'A gold-rimmed monocle, donated by the Hon. Bunty Fairweather-Flute, who has lost two others.',
      },
    ],
    notes:
      'No source quotes; all lines are new, and the rivals’ names are invented. The race is a short obstacle course on the ' +
      'existing race screen: matchboxes (tiny jumps), a low wall, and a sleeping Keeper in a deckchair to walk round ' +
      '(bumping them adds a two-second delay while they mumble). The three rivals are scripted to fail comically and can ' +
      'never win: Bunty faces the wrong way, Piers ties his lace to Algernon’s, Algernon stays waving at the start line. ' +
      'Commentary from Mrs Thackery plays over the race as barks. Winning is guaranteed if the player finishes.',
  },

  // ------------------------------------------------------------------ Q20
  {
    id: 'q20',
    code: 'Q20',
    title: 'And Now, the Larch',
    source: 'Monty Python’s Flying Circus: How to Recognise Different Types of Trees from Quite a Long Way Away',
    audience: 'all',
    trigger: { where: 'The edge of the orchard, beside a signboard', when: WHEN },
    speakers: [ARBOUR],
    steps: [
      {
        id: 'q20-s1',
        goal: 'Find and tap one of every kind of tree in the Grove.',
        hint: 'Your Grove has one tree for each fruit, plus the palm on the coast. Your journal ticks each one off.',
        check: 'tap:tree:every-kind',
        scene: {
          id: 'q20-intro',
          lines: [
            N('At the edge of the orchard, a Keeper in a grey suit stands beside a signboard with a picture of a tree on it.'),
            AR('Good afternoon. Today we shall learn to recognise the different trees of the Grove.', 'think'),
            AR('From quite near, mostly. My eyesight is not what it was.'),
            AR('Number one.'),
            AR('The larch.'),
            N('He points at the picture. It is a tall, thin, pointy tree, quite unlike anything in your Grove.'),
            Y('There aren’t any of those here.'),
            AR('Correct. Number two.', 'think'),
            N('He turns the board over. It is the same tree.'),
            AR('The larch.'),
            Y('That’s the same tree.'),
            AR('It is a larch. It is very important to recognise it. Particularly when it is absent.'),
            AR('Your task: find one of every tree you do have, and tap it. Recognise it. Up close.'),
          ],
          choices: [
            {
              id: 'three',
              label: 'Is number three a larch?',
              set: { 'q20-asked-three': true },
              then: [AR('…Let us not get ahead of ourselves.', 'think')],
            },
            {
              id: 'off-you-go',
              label: 'Off I go, then.',
              then: [AR('I shall wait here, by my larch.', 'happy')],
            },
          ],
        },
        done: {
          id: 'q20-trees',
          lines: [
            N('Run, swim, fly, power, stamina, sun, moon, heart. The palm, on the coast, looking tired.'),
            N('Each tree, once tapped, rustles slightly, as if pleased to be recognised.'),
            N('There is no larch. You check twice. You feel, absurdly, that you have let Mr Arbour down.'),
          ],
        },
      },
      {
        id: 'q20-s2',
        goal: 'Photograph Mr Arbour’s board from the meadow.',
        hint: 'Open Photo mode, zoom in on the far ridge and take the picture with the board in frame.',
        check: 'photo:subject:larch-board:far-ridge',
        scene: {
          id: 'q20-far',
          lines: [
            AR('Very good. Now the advanced class. Recognising a tree from quite a long way away.', 'think'),
            N('He picks up his signboard and walks off with it. He keeps walking. He goes over the hill.'),
            N('After a while, a tiny figure appears on the far ridge, holding up a tiny board.'),
            AR('Can you see it?', 'happy'),
            N('You can just make out the board. It shows a tall, thin, pointy tree. Of course it does.'),
            AR('Take a photograph! I shall stand here until you do, which is fine! I have brought a sandwich!'),
          ],
        },
        done: {
          id: 'q20-photo',
          lines: [
            N('Click. The picture is mostly sky, a bit of hill, and one small, clear, unmistakable larch.'),
            N('Far away, a tiny Mr Arbour lowers the board and takes a dignified bite of his sandwich.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q20-complete',
      lines: [
        N('Mr Arbour returns, slightly out of breath, and studies your photograph for a long time.'),
        AR('Yes. That is a larch.', 'soft'),
        AR('Most people walk past every tree they own and never once look up. You tapped all of yours.', 'think'),
        AR('The larch was only there to get you looking. You are the first student ever to recognise it twice. Here. Grow your own.'),
        N('He presses a small, pointed seed into your palm. A larch seed: a new tree for your Grove.'),
        AR('And a little button for your camera. Press it, and the picture becomes something else entirely.', 'think'),
        N('Photo mode has a new button that swaps to a random filter. Mr Arbour walks back to the orchard edge to stand beside nothing.'),
        N('A very large foot comes down out of the sky, considers the orchard, and goes back up again. Nobody mentions it.'),
      ],
    },
    rewards: [
      {
        id: 'larch-seed',
        kind: 'item',
        label: 'Larch Seed',
        description: 'A small pointed seed. Plant it to grow a larch: tall, thin, pointy, and bearing no fruit at all.',
      },
      {
        id: 'photo-something-different',
        kind: 'feature',
        label: 'Something Completely Different',
        description: 'A new button in Photo mode that swaps to a random filter.',
      },
    ],
    childLines: {
      'q20-intro#4': 'First: the larch.',
      'q20-intro#9': 'Second: the larch, again.',
    },
    notes:
      'Mr Arbour speaks slowly and evenly; give his voice blip a low, steady pitch. The signboard is a two-sided prop showing ' +
      'the same larch on both sides. Step 1 ticks off every fruit-tree type the Grove has plus the coast palm (if the player ' +
      'has not planted a type, the journal names it so they know). Step 2 places Mr Arbour and the board on the far ridge, ' +
      'visible from the meadow only with Photo mode zoom; the check passes when the board is in frame. Larch seeds plant ' +
      'like any tree, grow tall and thin, and drop no fruit. The reward label "Something Completely Different" is the name ' +
      'the brief gives the Photo mode button; it is never spoken in dialogue. Approved quote "The larch." (from "Number one. The larch.") used ' +
      'twice; both swapped in childLines. ' +
      'The giant foot in the complete scene is a one-off cut-in: a cut-out-style foot descends over the orchard, pauses, and lifts away, with no sound but a soft thump.',
  },
];

/**
 * Variant scenes for the fun-pack rules (src/sim/fun-pack-rules.ts): each is the quest's
 * complete scene with the payoff to an earlier choice written in. The base scene stays the
 * fallback when the flag is missing.
 *   q04-complete-kept / -shared   by q04-kept or q04-shared
 *   q06-complete-shouted / -laughed / -knocked   by q06-shouted, else q06-laughed, else q06-knocked
 *   q09-complete-themselves / -pebble   by q09-ruling === 'themselves', else any other ruling
 */
const completeWith = (qid: string, id: string, at: number, add: Line[], drop = 0): Scene => {
  const base = QUESTS_PYTHON.find((q) => q.id === qid)?.complete;
  if (!base) throw new Error(`no quest ${qid}`);
  return { ...base, id, lines: [...base.lines.slice(0, at), ...add, ...base.lines.slice(at + drop)] };
};

export const QUESTS_PYTHON_VARIANTS: Scene[] = [
  completeWith(
    'q04',
    'q04-complete-kept',
    0,
    [
      N('The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove.'),
      N('Nobody else gets a go. Trotwell clops past the whole queue, very politely smug.'),
    ],
    1,
  ),
  completeWith(
    'q04',
    'q04-complete-shared',
    0,
    [
      N('The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove.'),
      N('Everyone gets a go. Trotwell stands at the front of the queue and the back, which takes a lot of running.'),
    ],
    1,
  ),
  completeWith('q06', 'q06-complete-shouted', 5, [N('“P.P.S. The wall is NOT wonky.”')]),
  completeWith('q06', 'q06-complete-laughed', 5, [
    N('“P.P.S. You laughed. Nobody laughs on the wall. Do it again.”'),
  ]),
  completeWith('q06', 'q06-complete-knocked', 5, [N('“P.P.S. I have no rabbit. Stop knocking.”')]),
  completeWith('q09', 'q09-complete-themselves', 3, [
    N('The pebble group sleeps a little apart, on purpose. They have thought for themselves, and they think the heap is too warm.'),
  ]),
  completeWith('q09', 'q09-complete-pebble', 3, [
    N('The pebble group sleeps at the edge, still holding its pebble. Nobody has asked it anything. It is perfectly happy.'),
  ]),
];

export const CHECKS: string[] = [
  'give:item:shrubbery:tall-hood',
  'place:decor:terraced-shrubbery:waterfall-path',
  'karate:win:sir-dent:1',
  'karate:win:sir-dent:2',
  'karate:win:sir-dent:3',
  'count:nubbins:grove',
  'time:fly-nubbin:carry:coconut',
  'talk:gullwick',
  'talk:trotwell',
  'give:item:sun-fruit:sparks',
  'minigame:count:hand-melon:3',
  'craft:decor:wooden-rabbit',
  'push:decor:wooden-rabbit:far-wall',
  'gather:item:stone:12',
  'build:decor:model-castle:towers',
  'build:decor:aqueduct:falls-to-crops',
  'give:item:crop:reggie',
  'find:item:lost-shoe',
  'wear:item:gourd+lost-shoe',
  'shop:offer:harrow:below-asking',
  'minigame:haggle:harrow:3-rounds',
  'give:item:mint-leaves:mr-crisp',
  'watch:gorbold:wafer-slice',
  'collect:evidence:plush-nubbin:3',
  'talk:fenwick:evidence-3',
  'minigame:silly-walk:any',
  'minigame:silly-walk:score:silly',
  'carry:decor:comfy-chair:nest',
  'place:nubbin:comfy-chair:tired',
  'ask:dibble:fruit:6',
  'ask:dibble:fruit:12',
  'pay:shells:5:byte',
  'minigame:argue:byte:win',
  'karate:practice:dock-dance',
  'karate:win:dock-dance:timing',
  'class:fruit-defence:banana',
  'class:fruit-defence:raspberry',
  'class:fruit-defence:pineapple',
  'enter:race:toffs-cup',
  'race:win:toffs-cup',
  'tap:tree:every-kind',
  'photo:subject:larch-board:far-ridge',
];
