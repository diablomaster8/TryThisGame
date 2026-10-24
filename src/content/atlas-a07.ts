/**
 * Atlas campaign, page A7: The Marigold Bridge (Part L). Twelve quests, A7-1 to A7-12.
 *
 * SOURCE. Coco (2017), the Disney·Pixar animated film directed by Lee Unkrich and co-directed by
 * Adrian Molina. Rights: © Disney / Pixar, fully in copyright, with trade marks in the title and
 * the characters. This page needs a licence before ship (an open decision for Maor). Nothing from
 * the film's screenplay, songs or score is used: every line is newly written, every song is
 * described and never given, and the plot is retold in our own words. No Pixar design is copied;
 * if the page ships unlicensed, the characters need original designs and new names.
 *
 * AUDIENCE. 'all'. No line is lifted from the film, so no line needs a `childLines` replacement.
 * The Learning Grove version (Día de Muertos traditions: the ofrenda, cempasúchil, pan de muerto
 * and papel picado; Oaxacan alebrijes; Spanish family words) is a separate task.
 *
 * FRAME. Nova's atlas falls open at a page of marigolds and cut-paper flags. You and your Nubbin
 * step into Santa Cecilia, a small town in Mexico, on the eve of Día de Muertos, as visitors from
 * far away. Miguel Rivera is the hero, and his family keep their story: you carry petals, hold a
 * window, sit on steps, and witness. When Miguel strums the dead man's guitar, you are holding the
 * mausoleum window, and the page carries you across with him; the dead can see you because you
 * came in through a book, and a book is a kind of remembering. You need no blessing to get home:
 * the atlas brings you back when the page ends. Your Nubbin becomes a small alebrije, a spirit
 * guide in painted colours, alongside Dante the dog: the colours start on the bridge (A7-4) and
 * bloom fully in the cenote (A7-10). Nobody's animals talk in Coco's world, and Nubbins never talk.
 * In A7-1 Abuelita ties a strip of marigold-orange ribbon round your Nubbin's neck "so the dog
 * doesn't think it's a toy" (a plot prop, not a reward); in A7-6 Héctor's name may be stitched
 * into it.
 *
 * GROVE FLAGS READ: none. The outline asks for none, and this page reads no Grove state. (The
 * Grove ofrenda rewarded in A7-12 is a Grove feature; it reads your own departed Nubbins' photos
 * from the Grove save, read-only, see that quest's SIM note.) Hazel herself never appears here.
 * S24 (side-stories-s24.ts) keeps A7's margin note as engine data: once s24Done is set, Hazel's
 * note shows beside A7-12 "Remember" (Miguel sings to Mamá Coco). This page has no margin variant
 * of its own and writes nothing for it.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a7-; the Atlas never writes a Grove flag):
 *   - a7-01 … a7-12: each quest on completion. a7-done: the whole page (A7-12); the Night of
 *     Remembering festival reads it through atlasDone('A7').
 *   - a7-name = ribbon | promise (A7-6, a7-06-name), THE SIGNATURE CHOICE. Pays off in A7-10 (by
 *     the water in the cenote) and, six quests later, in A7-12: ribbon ties Héctor's stitched name
 *     round the mended photo on the ofrenda (the default scenes); promise has you say Héctor's
 *     name aloud to Mamá Coco before Miguel sings (ATLAS_A07_VARIANTS a7-10-water-promise,
 *     a7-12-coco-promise, a7-12-song-done-promise).
 *   - a7-plea = free | both | sit (A7-11, a7-11-blessing): which blessing you plead for. Picks the
 *     epilogue in A7-12 (a7-12-complete is free; a7-12-complete-both, a7-12-complete-sit).
 *
 * LIFTED TEXT. None. Coco is copyrighted; the outline lists no approved quotes, so none of the
 * three allowed is used. No song title or lyric from the film appears. Héctor's lullaby for
 * Coco, his quick song at the talent show and Imelda's old song are described, never sung. The
 * film's own place names used as names only: Santa Cecilia, the Land of the Dead, the Department
 * of Family Reunions, the Marigold Bridge, the Sunrise Spectacular, Shantytown.
 *
 * CARE NOTES.
 *   - Día de Muertos is a living tradition, kept by millions of families today. Present it with
 *     joy and respect: never "Mexican Halloween", never a costume party, never spooky. Skulls and
 *     skeletons are bright, smiling and homely. The ofrenda carries what families really set out:
 *     cempasúchil marigolds, candles, copal smoke, water, salt, pan de muerto, papel picado,
 *     photos and the loved one's favourite food. Mexican cultural consultants must check every
 *     custom, every Spanish word and accent, family terms, and the cemetery vigil before scripting
 *     is final (docs/atlas.md, "Advisers").
 *   - Alebrijes: the brightly painted creatures began with Pedro Linares in Mexico City in the
 *     1930s, and the carved wooden ones are a craft of Oaxacan towns such as San Martín Tilcajete
 *     and San Antonio Arrazola. The page's spirit alebrijes are the film's idea; don't present
 *     them as a belief.
 *   - Mamá Coco's failing memory is handled with dignity: no labels, no jokes at her expense. In
 *     the epilogue she has died, and it is said plainly and gently, with comfort straight after.
 *   - Héctor's death (Ernesto poisoned his drink) is told once, plainly and without detail. The
 *     "final death" of the forgotten (Chicharrón; Héctor nearly) is a soft fade into gold light,
 *     the Grove's own gentle fade. Ernesto is undone by being seen, and the falling bell is a
 *     comic pratfall: nobody is hurt.
 *   - No real person appears. In A7-5 Héctor is disguised as "the most famous painter in Mexico";
 *     she is never named and never speaks.
 *   - The ofrenda reward holds your Nubbins' photos; the Remembering Tree (canon 35, the Night of
 *     Remembering) holds their stories. Keep the two distinct.
 *   - Hazel's third rule is acted out (A7-2's step, A7-11's "sit" plea) and never quoted.
 *   - No timers: the night passes inside the page, never in real time. Sunrise is a story beat,
 *     not a countdown the player can fail.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Marigold Bridge page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const FILM = 'Coco (Disney·Pixar, 2017); original design';

// ------------------------------------------------------------------ speakers

const MIGUEL = sp('a7-miguel', 'Miguel', `Miguel Rivera, ${FILM}`);
const HECTOR = sp('a7-hector', 'Héctor', `Héctor, ${FILM}`);
const IMELDA = sp('a7-imelda', 'Mamá Imelda', `Mamá Imelda, ${FILM}`);
const ABUELITA = sp('a7-abuelita', 'Abuelita', `Abuelita (Elena Rivera), ${FILM}`);
const COCO = sp('a7-coco', 'Mamá Coco', `Mamá Coco, ${FILM}`);
const ENRIQUE = sp('a7-enrique', 'Papá', `Enrique Rivera, Miguel’s father, ${FILM}`);
const ERNESTO = sp('a7-ernesto', 'Ernesto de la Cruz', `Ernesto de la Cruz, ${FILM}`);
const ROSITA = sp('a7-rosita', 'Tía Rosita', `Tía Rosita, ${FILM}`);
const JULIO = sp('a7-julio', 'Papá Julio', `Papá Julio, ${FILM}`);
const TWINS = sp('a7-twins', 'Tío Óscar and Tío Felipe', `Tíos Óscar and Felipe, the twins, ${FILM}`);
const OFFICER = sp('a7-officer', 'Departures Officer', `the departures agent at the Marigold Bridge, ${FILM}`);
const CLERK = sp('a7-clerk', 'Clerk', `the clerk at the Department of Family Reunions, ${FILM}`);
const CHICH = sp('a7-chicharron', 'Chicharrón', `Chicharrón, ${FILM}`);
const EMCEE = sp('a7-emcee', 'Compère', `the talent-show host, ${FILM}`);
const DOORMAN = sp('a7-doorman', 'Doorman', `the doorman at Ernesto’s gate; original, ${FILM}`);
/** Héctor in A7-5, before he gives his name: the label must not spoil it. */
const PAINTER = sp('a7-painter', 'The Painter', `Héctor in disguise, ${FILM}`);

const N = say('narrator');
const Y = say('you');
const M = say('a7-miguel');
const H = say('a7-hector');
const I = say('a7-imelda');
const AB = say('a7-abuelita');
const CO = say('a7-coco');
const EN = say('a7-enrique');
const ER = say('a7-ernesto');
const RO = say('a7-rosita');
const JU = say('a7-julio');
const TW = say('a7-twins');
const OF = say('a7-officer');
const CL = say('a7-clerk');
const CH = say('a7-chicharron');
const EM = say('a7-emcee');
const DM = say('a7-doorman');
const PA = say('a7-painter');

// ------------------------------------------------------------------ A7-12 epilogue pieces

/** A7-12 epilogue, line 1 for the promise route (no ribbon on the frame). */
const PROMISE_OFRENDA = N(
  'The Riveras’ ofrenda is bigger than ever. Héctor’s photo is on it now, in the middle, where everyone can see him.',
);

/** A7-12 epilogue lines shared by every plea, after line 1. */
const EPI_COCO: Line[] = [
  N('Mamá Coco’s photo is on it too, beside her papá’s. She died in the spring, in her chair, with her family round her.', 'soft'),
  N('Tonight she is crossing the marigold bridge, holding her papá’s hand and her mamá’s, coming home to visit.', 'soft'),
];
const EPI_HOME = N('The page settles under your hand. You are back in the Grove, with a marigold petal still glowing in your pocket.');
const EPI_START = N('The atlas turns its own page, gently. It is a year later, and Día de Muertos again.');
const RIBBON_OFRENDA = N(
  'The Riveras’ ofrenda is bigger than ever. Héctor’s photo is on it now, in the middle, the ribbon still tied round the frame.',
);

const BOTH_BODY: Line[] = [
  N('This year Miguel put Héctor’s photo up himself, and Mamá Imelda’s right beside it, touching at the frames.'),
  N('On the bridge, Héctor walks between his wife and his daughter, and keeps stopping to wave at people. Mamá Imelda lets him.'),
  N('Miguel plays in the courtyard, and the whole street comes in to listen. Abuelita dances, badly, and doesn’t care who sees.'),
];
const SIT_BODY: Line[] = [
  N('Miguel plays in the courtyard. Then he stops, and sits down by his little cousin, who is shy of the crowd, and just waits.'),
  N('After a while she leans on him. After a longer while she asks him to play again, and he does.', 'soft'),
  N('Mamá Imelda, on the bridge, sees it, and says nothing, the way people say nothing when they are very proud.'),
];
const FREE_BODY: Line[] = [
  N('The whole house is full of music, with Miguel playing in the courtyard. Abuelita is dancing, badly, and doesn’t care who sees.'),
  N('Mamá Imelda listens from the ofrenda, and lets him play as long as he likes. Nobody puts down any rule tonight.'),
];

// =================================================================== THE MARIGOLD BRIDGE

export const ATLAS_A07: Quest[] = [
  // ---------------------------------------------------------------- A7-1
  {
    id: 'a7-01',
    code: 'A7-1',
    title: 'The Ofrenda',
    source: 'Coco (2017): the Rivera family and their ofrenda',
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [MIGUEL, ABUELITA, COCO],
    steps: [
      {
        id: 'a7-01-s1',
        goal: 'Step into the marigold page and find your way into the town square.',
        hint: 'Touch the page, then follow the cut-paper flags down to the square.',
        check: 'explore:a7-santa-cecilia:plaza',
        scene: {
          id: 'a7-01-plaza',
          lines: [
            N('Nova’s atlas falls open at a page of orange flowers and little paper flags, cut into birds and skulls and stars.'),
            N('The flags flutter as you look at them. Then there is a warm wind on your face, and the smell of something baking.'),
            N('You and your Nubbin are standing in a town square in Mexico, under strings of papel picado, on a bright afternoon.'),
            N('Everybody is carrying flowers. Great armfuls of marigolds, so orange they look lit from inside.'),
            N('Under a statue of a man with a guitar, a boy is polishing a customer’s shoe and talking much faster than he is polishing.'),
            M('…and he started with nothing, just a kid from Santa Cecilia like me, and he became the greatest musician in the world!'),
            N('The customer leaves. The boy notices you, and then your Nubbin, and his eyes go very wide.'),
            M('Whoa. What is that? Are you here for Día de Muertos? Everyone comes home for Día de Muertos.'),
          ],
          choices: [
            {
              id: 'visitor',
              label: '“We’re visitors. From very far away.”',
              then: [M('Then you have to see our ofrenda. My abuelita’s is the best in town. Don’t tell anyone I said that, they’ll all want to fight her.')],
            },
            {
              id: 'statue',
              label: 'Ask who the man on the statue is.',
              then: [
                M('Who is… that’s Ernesto de la Cruz! The most famous musician who ever lived. He was born right here.', 'shock'),
                M('Come on. If you don’t know that, you don’t know anything. I’ll show you around.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin say hello.',
              then: [N('Your Nubbin climbs up onto the shoe-shine box and sits in it. Miguel laughs so hard he has to sit down too.')],
            },
          ],
        },
        done: {
          id: 'a7-01-plaza-done',
          lines: [
            M('I’m Miguel. Miguel Rivera. Come on, before Abuelita sends out a search party.'),
            N('A skinny, hairless dog with his tongue hanging out falls in behind you as you go. He looks very pleased about everything.'),
            M('That’s Dante. He’s not my dog. He just thinks he is.'),
          ],
        },
      },
      {
        id: 'a7-01-s2',
        goal: 'Help carry the marigolds into the Riveras’ house.',
        hint: 'Take the flowers from the cart by the gate and bring them in to Abuelita.',
        check: 'carry:a7-marigolds:ofrenda',
        scene: {
          id: 'a7-01-petals',
          lines: [
            N('The Riveras’ house is a workshop as much as a house. There are shoes everywhere, on racks and lasts and in neat paper parcels.'),
            N('A small, sturdy woman in a shawl takes one look at you and puts a basket of marigolds in your arms.'),
            AB('Visitors? Good. Visitors can carry. You, take these in. Miguel, where have you been all afternoon?'),
            M('Nowhere, Abuelita. Shining shoes. Very boring. Very shoe.'),
            AB('Hm.', 'think'),
            N('She looks at your Nubbin for a long moment. Then she takes a strip of orange ribbon from her apron and ties it gently round its neck.'),
            AB('There. Now that dog won’t think it’s a toy.'),
            AB('Cempasúchil. Marigolds. The petals are bright and they smell strong, so the family can find their way home tonight.'),
            AB('You put the flowers on the ofrenda, and the photos, and the food they liked. And they come.'),
            N('Your Nubbin carries one marigold all by itself, very solemnly, with both arms.'),
          ],
        },
        done: {
          id: 'a7-01-petals-done',
          lines: [
            N('The basket is empty. Your arms smell of marigolds, and so does your Nubbin.'),
            AB('Good. Now you’ve worked, you can eat. Everybody who helps gets a tamal.', 'happy'),
          ],
        },
      },
      {
        id: 'a7-01-s3',
        goal: 'Look at the family ofrenda, and meet Mamá Coco.',
        hint: 'Go up to the altar at the end of the room and look at the photos.',
        check: 'inspect:a7-ofrenda:photo',
        scene: {
          id: 'a7-01-photo',
          lines: [
            N('The ofrenda rises in steps against the wall: candles, marigolds, sugar skulls with names iced on, bread, water, and a little dish of salt.'),
            N('And photographs. Dozens of them, in frames, some so old the faces are the colour of tea.'),
            M('That’s Papá Julio. Tía Rosita. Tío Óscar and Tío Felipe, they were twins, nobody could tell them apart, not even them.'),
            M('And that’s Mamá Imelda. My great-great-grandmother. She started the shoemaking.'),
            N('In the oldest photo, a stern woman stands beside a little girl. Beside them is a man in a suit, holding a guitar.'),
            N('The man’s face has been torn away. Someone has folded the edge under, so you can hardly see that anything is missing.'),
            M('Her husband was a musician. He left them to go and play for the world, and he never came back.', 'sad'),
            M('So Mamá Imelda threw music out of the house. And she made shoes instead. And we still make shoes.'),
            N('In a wheelchair beside the ofrenda sits a woman so old and so small she looks like a folded letter.'),
            M('This is Mamá Coco. She’s my great-grandmother. The little girl in the photo is her.', 'soft'),
            CO('Who are you? Are you new?', 'think'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Take her hand and tell her your name.',
              then: [CO('That’s a good name. I’ll try to keep it.', 'soft'), N('She holds your hand a while longer than people usually do.')],
            },
            {
              id: 'sit',
              label: 'Sit down beside her and say nothing.',
              then: [N('You sit, and she watches the candles with you. After a while she pats your knee, as if you’ve both agreed on something.')],
            },
            {
              id: 'nubbin',
              label: 'Lift your Nubbin up so she can see it.',
              then: [CO('Oh! You’re a funny one. Papá would have made a song about you.', 'happy'), N('Miguel goes very still at that.')],
            },
          ],
        },
        done: {
          id: 'a7-01-photo-done',
          lines: [
            CO('Is Papá home? Is he coming home?', 'think'),
            M('Not today, Mamá Coco.', 'soft'),
            N('Miguel says it as if he’s said it a hundred times, and as if it hurts every time.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-01-complete',
      lines: [
        N('Supper is loud. Abuelita feeds everyone twice, including your Nubbin, and Dante, who isn’t allowed in.'),
        N('Nobody hums, and nobody taps a spoon. In a house this full, it’s the strangest kind of quiet.'),
        M('Hey. After supper. I want to show you something. Something nobody knows about.', 'think'),
        N('Your Nubbin’s new ribbon flutters in the draught from the door, bright as a marigold.'),
      ],
    },
    rewards: [],
    sets: { 'a7-01': true },
    notes:
      'OPENING: the page is papel picado and marigolds; it unfolds into the square in a slow wash (two seconds). ' +
      'Santa Cecilia is drawn in our own style: a church tower, a bandstand, a statue of Ernesto with a guitar. ' +
      'The ofrenda is drawn accurately (steps, cempasúchil, candles, copal, water, salt, pan de muerto, sugar skulls, ' +
      'photos): CONSULTANT CHECK. Abuelita’s orange ribbon is a plot prop on this page only (Atlas save), never in ' +
      'the Grove; it carries Héctor’s name from A7-6 if a7-name = ribbon. Dante is a Xoloitzcuintli; he never talks.',
  },

  // ---------------------------------------------------------------- A7-2
  {
    id: 'a7-02',
    code: 'A7-2',
    title: 'The Ban',
    source: 'Coco (2017): Miguel’s secret, and the family rule',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-1') },
    requires: ['A7-1'],
    speakers: [MIGUEL, ABUELITA, ENRIQUE],
    steps: [
      {
        id: 'a7-02-s1',
        goal: 'Follow Miguel up to his secret hideout.',
        hint: 'Climb the ladder at the back of the workshop and squeeze in behind the loose boards.',
        check: 'visit:a7-hideout:attic',
        scene: {
          id: 'a7-02-hideout',
          lines: [
            N('Up a ladder, behind a loose board, there is a little room in the roof that smells of dust and candle wax.'),
            N('It is a shrine. Posters, records, a stack of old film reels, and candles all round a picture of Ernesto de la Cruz.'),
            M('Nobody comes up here. Not even Dante. Well, Dante does. But he doesn’t tell.'),
            N('Miguel lifts a guitar out from under a blanket. It is homemade, the body a wooden box, the frets marked in pen.'),
            M('I made it. I learned off his old films. I play along with the tape, and I stop the tape, and I go back, and I play it again.'),
            N('He plays. He is good, and better than good: his fingers know where to go before he does.'),
            N('Your Nubbin sways from side to side. Dante thumps his tail on the boards.'),
            M('There’s a talent show tonight. In the square. If I win, my family has to see I’m a musician. They’d have to.'),
          ],
          choices: [
            {
              id: 'tell',
              label: '“You should tell them.”',
              then: [M('Tell them? Abuelita would… you don’t understand. You’ve never seen her with a shoe in her hand.', 'shock')],
            },
            {
              id: 'play',
              label: '“Play it again.”',
              then: [N('He does, grinning, a little faster. Your Nubbin tries to clap along and claps exactly between the beats.')],
            },
            {
              id: 'why',
              label: 'Ask why music is banned, really.',
              then: [M('Because of him. The man in the photo. That’s all anyone says. Nobody ever says the rest.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a7-02-hideout-done',
          lines: [
            M('Come on. I need to see where they’re putting up the stage. Don’t say anything. Act like a tourist.'),
            N('You already are one, so this is easy.'),
          ],
        },
      },
      {
        id: 'a7-02-s2',
        goal: 'Walk with Miguel through the square to the talent-show sign.',
        hint: 'Keep close to Miguel and keep an eye out for Abuelita.',
        check: 'walk:a7-plaza:sign-up',
        scene: {
          id: 'a7-02-square',
          lines: [
            N('In the square, a man is pinning up a sign: a talent show, tonight, in honour of Ernesto de la Cruz.'),
            M('I just need a guitar. A real one. I can’t walk out there with a box.'),
            N('A mariachi with a kind face lets Miguel try his guitar on a bench. Miguel’s fingers are just getting going.'),
            AB('MIGUEL!', 'angry'),
            N('Abuelita crosses the square like weather. The mariachi suddenly remembers he has somewhere to be.'),
            AB('Music? In the square? On Día de Muertos, with your whole family watching from the ofrenda?', 'angry'),
            N('She marches him home by the ear. You follow, because you don’t know what else to do, and your Nubbin follows you.'),
            N('At the ofrenda, Miguel’s elbow knocks the oldest photo from its frame. The folded part falls open.'),
            M('Look. Look at the guitar. The man with no face. That’s his guitar. That’s Ernesto de la Cruz’s guitar.', 'shock'),
            N('Miguel slips the old photo into his jacket. Nobody notices one frame on the ofrenda is now empty.'),
          ],
        },
        done: {
          id: 'a7-02-square-done',
          lines: [
            N('The guitar in the old photo has a skull carved on its head, and a gold tooth set in the skull. You saw the same one on the statue.'),
            M('He’s my great-great-grandfather. Ernesto de la Cruz. I’m supposed to be a musician. It’s in my family!', 'happy'),
          ],
        },
      },
      {
        id: 'a7-02-s3',
        goal: 'Go after Miguel when he runs out of the house.',
        hint: 'Follow him out of the gate. When you find him, sit down with him.',
        check: 'sit:a7-miguel:steps',
        scene: {
          id: 'a7-02-guitar',
          lines: [
            N('Miguel runs up to the attic and back with his homemade guitar, and holds it up in front of everyone.'),
            M('I’m going to play in the talent show. I’m going to be a musician like him.'),
            EN('Mijo. No. You’re part of this family. Family comes first.', 'sad'),
            AB('There. One guitar. No more guitar.', 'angry'),
            N('She takes it from him and brings it down on the edge of the table. It breaks with a sound like a word nobody meant to say.'),
            N('Nobody moves. Even Abuelita looks as if she has hurt her own hand.'),
            M('I don’t want to be in this family!', 'angry'),
            N('Miguel is gone through the gate before anyone can stop him. Dante goes too.'),
            N('You find him on the church steps, his face in his knees. Dante is lying across his feet like a warm, bony blanket.'),
          ],
        },
        done: {
          id: 'a7-02-guitar-done',
          lines: [
            N('You don’t say anything. You sit down next to him and wait, and your Nubbin leans against his arm.'),
            N('After a long time, Miguel wipes his face on his sleeve.'),
            M('Thanks.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-02-complete',
      lines: [
        M('I still need a guitar. A real one. For tonight.'),
        N('He looks across the square. Beyond the church, the cemetery is filling up with candles, and with families carrying flowers.'),
        M('His guitar is in his tomb. On the wall. In the cemetery.', 'think'),
        M('He wouldn’t mind. He’d want me to play. I’m family. I’d just borrow it.'),
        N('Dante sneezes. It sounds a lot like an opinion.'),
      ],
    },
    rewards: [],
    sets: { 'a7-02': true },
    notes:
      'The broken guitar is a quick, quiet beat: one hit, a held silence, no splinters on screen. a7-02-guitar-done ' +
      'acts out Hazel’s third rule (sit and wait); it is not quoted. The skull headstock with a gold tooth is the ' +
      'film’s famous prop: if unlicensed, redraw it as our own (a carved marigold headstock).',
  },

  // ---------------------------------------------------------------- A7-3
  {
    id: 'a7-03',
    code: 'A7-3',
    title: 'The Guitar',
    source: 'Coco (2017): the mausoleum, and the dead come visiting',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-2') },
    requires: ['A7-2'],
    speakers: [MIGUEL, ROSITA, JULIO, TWINS],
    steps: [
      {
        id: 'a7-03-s1',
        goal: 'Walk through the cemetery with Miguel and Dante.',
        hint: 'Follow the candlelit path between the graves to the big tomb at the top.',
        check: 'walk:a7-cemetery:path',
        scene: {
          id: 'a7-03-cemetery',
          lines: [
            N('The cemetery at dusk is the busiest place in town. Every grave has a family round it.'),
            N('People are scrubbing headstones, laying marigold petals, setting out candles, unpacking suppers.'),
            N('An old man is telling a story to a grave, and laughing at his own jokes. Two children are asleep on a blanket.'),
            M('Everybody stays all night. You bring their favourite food, and you talk to them, and you remember.'),
            Y('It isn’t sad.'),
            M('It’s sad a bit. Mostly it’s a party. They’re visiting, so you have to make it nice.'),
            N('At the top of the hill there is a tomb as big as a chapel, with ERNESTO DE LA CRUZ over the door in stone.'),
            N('It is locked. There is a window, high up, and it is open a crack.'),
          ],
        },
        done: {
          id: 'a7-03-cemetery-done',
          lines: [
            M('Give me a boost. And hold the window. Don’t let it bang.'),
            N('You make a step with your hands. Your Nubbin holds Dante, or Dante holds your Nubbin; it’s hard to say which.'),
          ],
        },
      },
      {
        id: 'a7-03-s2',
        goal: 'Hold the window steady while Miguel climbs into the tomb.',
        hint: 'Keep your hands on the window frame until Miguel is down inside.',
        check: 'climb:a7-mausoleum:window',
        scene: {
          id: 'a7-03-window',
          lines: [
            N('Miguel wriggles through the window and drops down inside with a thump and a small, brave noise.'),
            N('You lean in after him, holding the frame. Moonlight comes in with you.'),
            N('On the wall above the tomb, in a glass case, is the guitar. White, with the skull on its head and the gold tooth shining.'),
            M('Señor de la Cruz. Please don’t be mad. I’m Miguel. Your great-great-grandson. I think.'),
            M('I need to borrow this. Just for tonight. I’ll bring it straight back. I promise.'),
            N('He lifts the case. He takes out the guitar as if it might wake up.'),
          ],
          choices: [
            {
              id: 'careful',
              label: '“Careful.”',
              then: [M('I’m always careful.'), N('He isn’t, quite. But he’s very careful now.')],
            },
            {
              id: 'sure',
              label: '“Are you sure about this?”',
              then: [M('No. Yes. If I don’t play tonight, I’ll never play.', 'think')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and hold the window.',
              then: [N('You hold the window, and your Nubbin holds your sleeve. Everyone holds their breath.')],
            },
          ],
        },
        done: {
          id: 'a7-03-window-done',
          lines: [
            N('Miguel strums once. One chord, loud in the stone room.'),
            N('A gust comes from nowhere. Every marigold petal on the floor of the tomb lifts at once and glows.'),
            N('The atlas in your pocket goes warm. Your hands are still on the window frame, and the frame is suddenly very far away.'),
          ],
        },
      },
      {
        id: 'a7-03-s3',
        goal: 'Find Miguel among the graves, and meet the visitors.',
        hint: 'Follow the glow down the hill. Look for the people nobody else can see.',
        check: 'watch:a7-family:graves',
        scene: {
          id: 'a7-03-visitors',
          lines: [
            N('A man with a torch comes running up to the tomb, shouting about a thief. He runs straight past Miguel.'),
            N('Miguel waves at him, and the man doesn’t see. Then he walks straight through Miguel, and doesn’t even shiver.'),
            M('What… what’s happening to me?', 'shock'),
            N('Down the path come people who weren’t there before: skeletons, in hats and shawls and good shoes, chatting as they walk.'),
            N('They glow faintly, like a lamp behind a curtain. They stop to smell the marigolds on their own graves.'),
            N('They can see you, and your Nubbin. They can certainly see Miguel.'),
            RO('Miguel? Is that our Miguel?', 'shock'),
            JU('It can’t be. He’s alive. Isn’t he alive? Mijo, are you alive?', 'shock'),
            TW('He looks very alive.'),
            N('They are the faces from the ofrenda photographs: Tía Rosita, round and sweet; Papá Julio, with his great moustache; the twins.'),
          ],
        },
        done: {
          id: 'a7-03-visitors-done',
          lines: [
            RO('And who’s this? A friend? A friend with a little… what is it? Is it a dog?'),
            N('Your Nubbin hides behind your leg. Then it peeks out and waves, which settles the matter.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-03-complete',
      lines: [
        JU('We have to take him to Mamá Imelda. She’ll know what to do.'),
        TW('She always knows what to do. And then she does it to you.'),
        RO('You’ll come too, won’t you? You came in with him. You must be meant to.', 'soft'),
        N('The atlas in your pocket is warm and patient. You don’t think it is going to let you go home without him.'),
      ],
    },
    rewards: [],
    sets: { 'a7-03': true },
    notes:
      'Miguel becomes invisible and untouchable to the living the moment he strums the guitar of a dead man on Día ' +
      'de Muertos; the dead can see him. The page explains your own state in one image (the atlas goes warm). The ' +
      'dead are bright, friendly skeletons; their bones are painted with soft patterns. They stop to touch the ' +
      'flowers on their own graves: keep that beat, it is the custom made visible. CONSULTANT CHECK on the vigil.',
  },

  // ---------------------------------------------------------------- A7-4
  {
    id: 'a7-04',
    code: 'A7-4',
    title: 'The Marigold Bridge',
    source: 'Coco (2017): the bridge of petals, and the Land of the Dead',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-3') },
    requires: ['A7-3'],
    speakers: [MIGUEL, ROSITA, JULIO, TWINS, OFFICER, IMELDA],
    steps: [
      {
        id: 'a7-04-s1',
        goal: 'Cross the Marigold Bridge with the Rivera family.',
        hint: 'Walk out onto the bridge of petals and keep going, even when it glows.',
        check: 'walk:a7-bridge:petals',
        scene: {
          id: 'a7-04-bridge',
          lines: [
            N('Beyond the cemetery wall, where the field should be, there is a bridge. It is made of marigold petals, all the way across.'),
            N('It arches out into a blue dark, and on the far side there is a city of lights, stacked up and up like a cake with too many tiers.'),
            M('That’s… that’s where you live?', 'shock'),
            RO('Where we stay. Tonight we visit. Tomorrow we go home. Come on, it holds. It’s only flowers, but it holds.'),
            N('With every step, the petals under your feet flare gold and orange, and then settle, like embers being kind.'),
            N('Dante runs ahead, barking at nothing. Every pawprint glows.'),
            N('Halfway over, your Nubbin stops. Its body is changing colour, slowly, in stripes and spots, like paint soaking into paper.'),
            N('There is magenta at the tips of its ears and green along its back, with a little row of yellow dots down its tail.'),
          ],
          choices: [
            {
              id: 'pick',
              label: 'Pick your Nubbin up.',
              then: [N('It is warm, and it smells of marigolds, and it is very pleased with itself.')],
            },
            {
              id: 'look',
              label: 'Let it look at itself in a puddle of light.',
              then: [N('It turns round and round to see its own tail. Then it does a little hop, which leaves a pink pawprint glowing on the bridge.')],
            },
          ],
        },
        done: {
          id: 'a7-04-bridge-done',
          lines: [
            TW('An alebrije! Look! The little one’s turning into a spirit guide.', 'happy'),
            JU('They find you, the alebrijes. Bright creatures, all painted. They help the dead find their way.'),
            M('I thought they were just carvings. My cousin sells them to tourists.', 'think'),
          ],
        },
      },
      {
        id: 'a7-04-s2',
        goal: 'Go through the departures gate on the far side of the bridge.',
        hint: 'Join the queue by the gate and wait your turn with the family.',
        check: 'visit:a7-bridge:departures',
        scene: {
          id: 'a7-04-gate',
          lines: [
            N('At the far end, the dead are coming back and going out through a great hall, like a railway station with a lot more flowers.'),
            N('At the far desks, a queue of skeletons in their best clothes waits to cross into the living world for the night.'),
            OF('Next. Look into the camera, please. Is your photo up on an ofrenda tonight?'),
            N('Each skeleton steps up to a screen. Their photo appears on it, on some family’s altar, and the officer waves them through.'),
            N('Then a woman steps up who is all straight back and folded arms. You know her from the photo at once.'),
            OF('I’m sorry, señora. No photo. No ofrenda. You can’t cross tonight.'),
            I('That’s impossible. My photo is up every year. Every year.', 'angry'),
            I('It’s my family. If my photo isn’t up, something has happened. Someone has done something.', 'angry'),
            RO('Mamá Imelda! Mamá Imelda, look who we found!'),
            N('Mamá Imelda turns round. Her eyes go to Miguel, then to the photo sticking out of his pocket, then back to Miguel.'),
          ],
        },
        done: {
          id: 'a7-04-gate-done',
          lines: [
            I('Miguel?', 'shock'),
            M('Hola, Mamá Imelda…', 'sad'),
            N('Your Nubbin, glowing pink and green, tries very hard to look like a decoration.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-04-complete',
      lines: [
        N('Behind you, the bridge glows on and on into the dark, carrying the dead home to their families, one petal at a time.'),
        N('You find a marigold petal stuck to your shoe, still glowing a little. You keep it.'),
        OF('Family business? Department of Family Reunions. Second floor. Take a number.'),
        I('Come. All of you. We will sort this out, and then somebody will explain to me exactly what is going on.'),
      ],
    },
    rewards: [
      {
        id: 'a7-marigold-paths',
        kind: 'decor',
        label: 'Marigold Paths',
        description:
          'Paths of scattered marigold petals for the Grove. Your Nubbins leave a soft glowing pawprint where they step, which fades after a moment.',
      },
    ],
    sets: { 'a7-04': true },
    notes:
      'The bridge is the page’s great image: a long walk, no puzzle, the petals flaring under each step. Your Nubbin ' +
      'begins its alebrije change here (painted stripes and dots, our own patterns, not a copy of Dante’s or ' +
      'Pepita’s); it completes in A7-10. The departures hall checks photos on ofrendas: keep it gently comic, ' +
      'airport-like. Reward: marigold paths, one-time; the pawprint glow is cosmetic only.',
  },

  // ---------------------------------------------------------------- A7-5
  {
    id: 'a7-05',
    code: 'A7-5',
    title: 'The Department of Family Reunions',
    source: 'Coco (2017): the curse, and a blessing with a condition',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-4') },
    requires: ['A7-4'],
    speakers: [MIGUEL, IMELDA, CLERK, PAINTER, JULIO, TWINS],
    steps: [
      {
        id: 'a7-05-s1',
        goal: 'Take a number and wait your turn at the Department of Family Reunions.',
        hint: 'Take a ticket from the machine and sit with the family until your number is called.',
        check: 'wait:a7-reunions:queue',
        scene: {
          id: 'a7-05-queue',
          lines: [
            N('The Department of Family Reunions is a long room of desks, rubber stamps and filing cabinets that go up into the dark.'),
            N('You take a ticket that says 2,409. The board says 2,377.'),
            TW('It’s quick tonight. Last year we waited four years.'),
            N('At the next desk, a tall, thin skeleton in a borrowed dress and a painted-on monobrow is arguing with a clerk.'),
            PA('I am the most famous painter in Mexico. Look. My eyebrows. Who else has eyebrows like this?'),
            N('The clerk looks at his screen. There is no photo of him anywhere, and there never is.'),
            PA('Please. It’s just one night. There’s someone I need to see before she forgets me.', 'sad'),
            N('Two guards walk him out. On the way past, he winks at your Nubbin, and almost loses an eyebrow.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Wave him goodbye.',
              then: [N('He waves back with a flourish. The guards take the other eyebrow off him at the door.')],
            },
            {
              id: 'ask',
              label: 'Ask the family who he is.',
              then: [JU('Nobody. Somebody nobody remembers. There are a lot of them, over on the far side of town.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a7-05-queue-done',
          lines: [
            CL('Two-four-oh-nine?'),
            N('Somehow it’s your number already. The atlas, you suspect, is helping.'),
          ],
        },
      },
      {
        id: 'a7-05-s2',
        goal: 'Hear what the clerk has to say about Miguel.',
        hint: 'Sit at the desk with Miguel and Mamá Imelda and listen.',
        check: 'talk:a7-clerk:curse',
        scene: {
          id: 'a7-05-curse',
          lines: [
            CL('Hmm. Living boy. In the Land of the Dead. Took something from a grave on Día de Muertos. That’s a curse, that is.'),
            M('A curse?!', 'shock'),
            CL('Don’t worry. Paperwork. You need a blessing from your family to go back. Before sunrise.'),
            CL('If the sun comes up and you’re still here, you stay. You’ll be one of us.'),
            N('Miguel looks down at his hand. The tips of his fingers have gone pale and see-through, and you can see the bones inside.'),
            CL('Any member of the family can give it. A marigold petal. Say the blessing. Done. Next!'),
            N('Mamá Imelda takes a petal from her shawl. Then she stops.'),
            I('Miguel. I give you my blessing to go home. And to put my photo back on the ofrenda.'),
            I('And never to play music again.', 'angry'),
            M('What? No! That’s not fair!', 'angry'),
            I('That’s the blessing. That’s the only blessing. I will not lose another one to a guitar.'),
          ],
        },
        done: {
          id: 'a7-05-curse-done',
          lines: [
            N('Miguel takes the petal, and it flares, and he is gone, back into the living world. For one breath.'),
            N('Then he is back, standing in the same place, very sheepish, with his hand still reaching out for something.'),
            M('I… reached for the guitar. I wasn’t even thinking. I just picked it up.', 'sad'),
            I('So. You heard me.', 'angry'),
          ],
        },
      },
      {
        id: 'a7-05-s3',
        goal: 'Stay with Miguel when he runs from the Department.',
        hint: 'Follow Miguel out through the crowds. Don’t let him go alone.',
        check: 'escort:a7-miguel:streets',
        scene: {
          id: 'a7-05-run',
          lines: [
            M('I don’t need your blessing. I have another family. A musician. He’ll understand.', 'angry'),
            M('Ernesto de la Cruz. He’s my great-great-grandfather. And he’ll give me his blessing without any rules!'),
            I('That man is not…', 'angry'),
            N('But Miguel is already running, down the stairs and out into the streets of the Land of the Dead.'),
            N('Dante bounds after him, delighted, as if this is the best game anyone has ever invented.'),
            N('Mamá Imelda looks at you. Her face is fierce, and frightened under the fierce.'),
          ],
          choices: [
            {
              id: 'keep',
              label: '“I’ll stay with him. I’ll keep him safe.”',
              then: [I('Keep him safe, then. And bring him back to me.', 'sad')],
            },
            {
              id: 'why',
              label: '“Why do you hate music so much?”',
              then: [I('I don’t hate it. I loved it. That’s the trouble.', 'sad'), I('Go on. Go after him. Quickly.')],
            },
          ],
        },
        done: {
          id: 'a7-05-run-done',
          lines: [
            N('You catch up with Miguel in a back street, out of breath, his see-through fingers stuffed in his pockets.'),
            M('I just need to find Ernesto. That’s all. How hard can it be?'),
            N('Above you, on every wall, his smiling face is on a poster. All of them say SOLD OUT.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-05-complete',
      lines: [
        N('Behind you, in the Department, Mamá Imelda is filling out a form for a missing boy. She presses so hard the pen goes through.'),
        N('Somewhere in the city, a tall thin skeleton picks the last bit of eyebrow off his face and looks thoughtfully at the poster too.'),
      ],
    },
    rewards: [],
    sets: { 'a7-05': true },
    notes:
      'The clerk is a comic bureaucrat, never menacing. Miguel’s fading shows as see-through fingertips with bones ' +
      'inside, drawn softly (no gore). The deadline is a story beat, not a timer (canon 22). Héctor’s disguise: a ' +
      'borrowed dress and a painted monobrow, as “the most famous painter in Mexico”; she is a real person, never ' +
      'named and never shown as herself. The blessing is a glowing marigold petal and a spoken wish.',
  },

  // ---------------------------------------------------------------- A7-6
  {
    id: 'a7-06',
    code: 'A7-6',
    title: 'Héctor',
    source: 'Coco (2017): Héctor’s bargain, Chicharrón, and the final death',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-5') },
    requires: ['A7-5'],
    speakers: [MIGUEL, HECTOR, CHICH],
    steps: [
      {
        id: 'a7-06-s1',
        goal: 'Hear out the tall skeleton who follows you down the alley.',
        hint: 'He’s waving from behind the bins. Go and talk to him.',
        check: 'talk:a7-hector:alley',
        scene: {
          id: 'a7-06-alley',
          lines: [
            H('Psst. Psst. Living boy. Over here. And the… friend. And the… very colourful thing.'),
            N('It is the painter from the Department, without the dress. His suit is shabby and his hat has a hole in it.'),
            H('Héctor. A pleasure. I couldn’t help hearing you need Ernesto de la Cruz. And I need a favour.'),
            H('I know him. Old friend. Well, old acquaintance. Well, I played with him, once, back in the day.'),
            H('I get you to him. And you, when you go home, you take my photo and put it on your ofrenda. Just one year. So I can cross.'),
            M('Why do you need to cross so badly?'),
            H('Somebody up there I want to see. Before she forgets me. Before it’s too late.', 'soft'),
            N('He holds out a bony hand. Miguel looks at you.'),
          ],
          choices: [
            {
              id: 'shake',
              label: 'Nod to Miguel: shake on it.',
              then: [M('Deal.'), H('Deal! Ha! You won’t regret this. Probably.', 'happy')],
            },
            {
              id: 'trust',
              label: '“Can we trust you?”',
              then: [H('Absolutely not. But I’m all you’ve got, amigo.'), N('Miguel shakes his hand anyway. You think it’s the honesty that does it.')],
            },
          ],
        },
        done: {
          id: 'a7-06-alley-done',
          lines: [
            N('He tucks a small, creased photo of himself into Miguel’s pocket, beside the old family one.'),
            H('For your ofrenda. Don’t lose it. It’s the only one there is.'),
            H('First, the boy needs a guitar. You can’t walk up to the greatest musician in the world empty-handed.'),
            H('I know a man who has one. Come on. And don’t touch anything in Shantytown. Some of it’s still holding the rest up.'),
          ],
        },
      },
      {
        id: 'a7-06-s2',
        goal: 'Go with Héctor to Shantytown to borrow a guitar from his friend.',
        hint: 'Follow Héctor down the stairs to the edge of the city, to the hut by the water.',
        check: 'visit:a7-chicharron:shantytown',
        scene: {
          id: 'a7-06-shantytown',
          lines: [
            N('At the bottom of the city, under all the lights, there is a place of tin roofs and string, where the forgotten live.'),
            N('In a hammock in a hut lies an old skeleton with a bad temper and a guitar on his chest.'),
            CH('Héctor. Last time I lent you something, I never saw it again.', 'angry'),
            H('Chicharrón, my friend. That was a mule. A guitar is completely different.'),
            CH('Fine. Take it. Only… play me something first. One of mine. Something I used to like.', 'soft'),
            N('Héctor plays: an old, rude, silly song about a man and his fine moustache. Chicharrón laughs with his eyes shut.'),
            N('As the last note goes, Chicharrón begins to shine. A soft gold light lifts off him, like dust in a sunbeam.'),
            CH('Ah. That’s nice. That’s… nice.', 'soft'),
            N('And then the hammock is empty, and still gently swinging.'),
            M('Where did he go?', 'shock'),
            H('Nobody knows. Nobody up there remembers him any more. When the last one forgets you, you go. That’s all.', 'sad'),
          ],
        },
        done: {
          id: 'a7-06-shantytown-done',
          lines: [
            N('Héctor puts the guitar in Miguel’s hands. His own hand is shaking, and it shines, very faintly, gold at the edges.'),
            M('Héctor. Your hand.'),
            H('It’s nothing. It comes and goes. Mostly comes, lately.', 'sad'),
          ],
        },
      },
      {
        id: 'a7-06-s3',
        goal: 'Héctor asks you to remember his name. Decide how.',
        hint: 'Sit with Héctor on the step outside the hut and answer him.',
        check: 'choose:a7-name:hut',
        scene: {
          id: 'a7-06-name',
          lines: [
            N('Miguel walks a little way off with the guitar, trying chords. You sit on the step with Héctor, and Dante sits on Héctor.'),
            H('There’s one person up there who still remembers me. Only one. And she’s very old.', 'sad'),
            H('When she forgets, I go the way Chicharrón went. So I’m asking everyone I meet. Even strangers. Even you.'),
            H('Will you remember my name? Héctor. That’s all. Just Héctor.'),
            N('He looks at your Nubbin’s orange ribbon. He pulls a loose thread from the cuff of his old jacket.'),
            H('Or. If you wanted. If it’s not too much. You could put it somewhere it couldn’t fall out of your head.'),
          ],
          choices: [
            {
              id: 'ribbon',
              label: 'Stitch his name into your Nubbin’s ribbon.',
              set: { 'a7-name': 'ribbon' },
              then: [
                N('Héctor threads his jacket thread onto a fishbone needle. You stitch, slowly, with your Nubbin very still: H, É, C, T, O, R.'),
                N('The letters are crooked, and the accent is a bit big. Héctor holds the ribbon up to the light for a long time.'),
                H('Nobody’s written my name down in a hundred years. It looks good. It looks like somebody.', 'soft'),
              ],
            },
            {
              id: 'promise',
              label: 'Promise him. Just your word.',
              set: { 'a7-name': 'promise' },
              then: [
                Y('Héctor. I won’t forget. I promise.'),
                N('He looks at you hard, the way people look at a coin to see if it’s real.'),
                H('A promise. All right. I’ve made a lot of those. Let’s see if one of us can keep one.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a7-06-name-done',
          lines: [
            H('Right! Enough sitting. We have a boy to make famous, and a famous man to find.', 'happy'),
            N('He jumps up, and only wobbles a little.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-06-complete',
      lines: [
        M('Héctor? How do we get to Ernesto? There were posters everywhere. Sold out.'),
        H('There’s a talent show tonight. The winner gets to play at his party. At his mansion. In front of him.'),
        M('A talent show? I was going to play in a talent show tonight!', 'happy'),
        H('Then you’re already practised. Come on. And you’re going to need a better face.'),
      ],
    },
    rewards: [],
    sets: { 'a7-06': true },
    notes:
      'SIGNATURE CHOICE (a7-name, set in a7-06-name). ribbon: Héctor’s name is stitched in his jacket thread on ' +
      'Abuelita’s orange ribbon (Atlas save, this page only); show it on your Nubbin from now on. promise: no ' +
      'visible change. Pays off in A7-10 (a7-10-water / variant a7-10-water-promise) and A7-12 (a7-12-coco, ' +
      'a7-12-song-done / their -promise variants). Chicharrón’s fade is the Grove’s soft fade into gold motes, ' +
      'hammock still swinging: no fear, no darkness. His song is described (a comic old song) and never sung. ' +
      'The fishbone needle is a homely Shantytown detail.',
  },

  // ---------------------------------------------------------------- A7-7
  {
    id: 'a7-07',
    code: 'A7-7',
    title: 'The Talent Show',
    source: 'Coco (2017): the disguise, the stage, and an argument',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-6') },
    requires: ['A7-6'],
    speakers: [MIGUEL, HECTOR, EMCEE, IMELDA],
    steps: [
      {
        id: 'a7-07-s1',
        goal: 'Help paint Miguel’s face so he looks like one of the dead.',
        hint: 'Hand Héctor the white paint and the black, and hold the mirror steady.',
        check: 'craft:a7-disguise:paint',
        scene: {
          id: 'a7-07-paint',
          lines: [
            H('Hold still. A living boy at a talent show for the dead. They’ll have you out of there by your ear.'),
            N('Héctor paints Miguel’s face white with a brush, then black round his eyes, then a row of skull teeth across his lips.'),
            M('Do I look dead?'),
            H('You look like a boy who fell in some paint. But it’s dark in there.'),
            N('Your Nubbin, all pink and green and yellow, holds up a little mirror. Miguel grins at himself, and the painted teeth grin too.'),
            H('Now. Stage fright. You have stage fright?'),
            M('I’ve never been on a stage.'),
            H('Then you don’t know you have it yet. Good. Don’t find out.'),
          ],
          choices: [
            {
              id: 'mirror',
              label: 'Paint a small skull on your own cheek too.',
              then: [H('Look at that! A natural. You’ve been dead for years.', 'happy')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin dab a dot on Miguel’s nose.',
              then: [M('Hey!'), H('No, leave it. It’s good. It’s… artistic.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a7-07-paint-done',
          lines: [
            N('Overhead, the papel picado flags across the square are cut into dancing skeletons. They wave in the warm wind.'),
            EM('Next! The… boy with the paint. And the tall one. And the little bright thing.'),
          ],
        },
      },
      {
        id: 'a7-07-s2',
        goal: 'Go on stage with Miguel and Héctor.',
        hint: 'Keep time with the music: tap with the beat to get the crowd clapping.',
        check: 'minigame:a7-talent:stage',
        scene: {
          id: 'a7-07-stage',
          lines: [
            N('The stage is a ring of light. Beyond it are hundreds of skeletons in their best clothes, chatting and not listening.'),
            N('Miguel’s hands won’t move. His mouth opens, and nothing comes out.'),
            H('Hey. Hey, chamaco. Forget them. Look at me. Just play. Play like it’s the attic.', 'soft'),
            N('Miguel looks at Héctor, and at your Nubbin, who is bouncing. He starts to play.'),
            N('It is a quick, silly song that Héctor wrote long ago, all stamping feet and a singer going dizzy over someone.'),
            N('By the second time round, the crowd is clapping. By the third, they are on their feet.'),
            N('Your Nubbin dances in a circle at the front of the stage, glowing brighter every turn.'),
            N('Somewhere in the middle of it, Héctor stops performing, and just watches Miguel play, with a very strange look on his face.'),
          ],
        },
        done: {
          id: 'a7-07-stage-done',
          lines: [
            EM('And tonight’s winner, by the loudest clapping this hall has ever had, is…'),
            N('Then, behind the crowd, a voice even louder than the crowd.'),
            I('MIGUEL!', 'angry'),
            N('The whole Rivera family is pushing through the crowd. Mamá Imelda has her shoe in her hand.'),
          ],
        },
      },
      {
        id: 'a7-07-s3',
        goal: 'Get away through the back streets, and then stay with Miguel.',
        hint: 'Run out behind the stage. When you stop, stand by Miguel.',
        check: 'escort:a7-miguel:backstreets',
        scene: {
          id: 'a7-07-row',
          lines: [
            N('You run, all of you, out of the back of the stage and down an alley, until the shouting is a long way off.'),
            H('Ha! Did you see them? Did you hear them? Chamaco, you’re a musician.', 'happy'),
            H('Now. The party is that way. And my photo, don’t forget, my photo goes up on your ofrenda when…'),
            M('Is that all you care about? Your photo?', 'angry'),
            H('It’s not all I care about! But it’s… it’s important. You don’t understand.', 'sad'),
            M('I understand. You’re just using me. You’re not my family. Ernesto is my family.', 'angry'),
            H('Fine! Go to your famous family! Go!', 'angry'),
            N('Miguel runs. Héctor stands in the alley with his arms out, as if he’s still holding a guitar.'),
            N('His hand is shining at the edges again. Brighter now.'),
          ],
          choices: [
            {
              id: 'follow',
              label: 'Follow Miguel.',
              then: [N('You go after Miguel, because you told Mamá Imelda you would.')],
            },
            {
              id: 'stay',
              label: 'Stop by Héctor first, just for a moment.',
              then: [
                N('You put a hand on his arm, and his sleeve is thin. He looks at you, and then down at your Nubbin.'),
                H('Go. Go on. Keep him safe. Somebody should.', 'sad'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a7-07-complete',
      lines: [
        N('Miguel stops under a long string of papel picado that someone has hung between two houses. It is cut into guitars.'),
        M('I don’t need any of them. I just need him.', 'sad'),
        N('Your Nubbin reaches up and pulls one of the paper flags free, and gives it to Miguel. He smiles a tiny bit, by accident.'),
        N('High above the city, a tower is lit up like a birthday, every window gold. Up there, someone is having a party.'),
      ],
    },
    rewards: [
      {
        id: 'a7-papel-picado',
        kind: 'decor',
        label: 'Papel Picado Banner',
        description:
          'A string of bright cut-paper flags for the Grove, punched with marigolds, guitars and dancing Nubbins. It flutters in every breeze.',
      },
    ],
    sets: { 'a7-07': true },
    notes:
      'The talent-show minigame is a gentle rhythm tap (no fail state; a bigger crowd for good timing). Héctor’s quick ' +
      'song is described only, and is ours: original music. Héctor’s “strange look” is the first hint of what A7-10 ' +
      'reveals. The row is real but short: Miguel says something unkind in our words; never quote the film. Reward: ' +
      'papel picado banner, one-time; its patterns (marigolds, guitars, Nubbins) are our own.',
  },

  // ---------------------------------------------------------------- A7-8
  {
    id: 'a7-08',
    code: 'A7-8',
    title: 'The Mansion',
    source: 'Coco (2017): Ernesto de la Cruz’s party',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-7') },
    requires: ['A7-7'],
    speakers: [MIGUEL, ERNESTO, DOORMAN],
    steps: [
      {
        id: 'a7-08-s1',
        goal: 'Get into Ernesto de la Cruz’s party with a band of musicians.',
        hint: 'Pick up a guitar case and walk in with the band, as if you belong.',
        check: 'carry:a7-case:mansion',
        scene: {
          id: 'a7-08-gate',
          lines: [
            N('The tower at the top of the city is Ernesto’s house. At the gate, a doorman is checking a list.'),
            N('A band of skeleton musicians is going in: guitars, trumpets, violins, a harp carried by three of them.'),
            M('I never got my prize. Fine. I’m with the band now.'),
            N('You pick up a spare guitar case, which is heavier than it looks. Your Nubbin picks up a maraca, which is lighter than it looks.'),
            DM('Instruments?'),
            M('Guitar.'),
            N('Your Nubbin shakes its maraca once, with enormous authority.'),
            N('The doorman looks at the maraca for a long time. Then he sighs, and waves you all through.'),
            N('Inside, the party is enormous. There are fountains, and a pool, and a whole wall where Ernesto’s old films play on a loop.'),
            M('There he is. There he is!', 'happy'),
          ],
        },
        done: {
          id: 'a7-08-gate-done',
          lines: [
            N('Across the pool, under a spotlight he seems to have brought with him, stands Ernesto de la Cruz.'),
            N('He is exactly like his statue: tall, white suit, big smile. People around him laugh before he’s finished his jokes.'),
          ],
        },
      },
      {
        id: 'a7-08-s2',
        goal: 'Help Miguel when he falls in the pool.',
        hint: 'Get to the edge of the pool and help pull Miguel out.',
        check: 'swim:a7-pool:mansion',
        scene: {
          id: 'a7-08-pool',
          lines: [
            N('Miguel takes the guitar and plays, as loud as he can, trying to be heard over the party. Nobody turns round.'),
            N('He backs up to get a better view. He backs up one step too far.'),
            N('He goes into the pool with a great splash. The guitar goes in after him.'),
            N('Your Nubbin dives straight in after both. It swims like a little painted fish, round and round Miguel.'),
            N('Then a big white sleeve comes down into the water, and a big hand hauls Miguel up onto the side.'),
            ER('Easy, easy! Are you all right, my boy? Saved, just like in the movies!', 'happy'),
            N('Ernesto laughs, and everyone laughs with him. Then he sees the paint run off Miguel’s face, and stops.'),
            ER('Wait. You’re… you’re alive. A living boy. Here?', 'shock'),
            M('I’m Miguel. I’m your great-great-grandson. I came to ask for your blessing.'),
          ],
          choices: [
            {
              id: 'help',
              label: 'Wrap Miguel in a towel.',
              then: [N('You find a towel by a lounger and wrap it round him. He is shivering, and grinning, and shivering.')],
            },
            {
              id: 'nubbin',
              label: 'Help your Nubbin out of the pool.',
              then: [N('Your Nubbin climbs out on its own and shakes. Ernesto’s white suit is now spotted with pink.')],
            },
          ],
        },
        done: {
          id: 'a7-08-pool-done',
          lines: [
            ER('A great-great-grandson! Everyone! I have a great-great-grandson, and he plays!', 'happy'),
            N('The crowd cheers, and Ernesto lifts Miguel onto his shoulders. Miguel looks as if every birthday has come at once.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-08-complete',
      lines: [
        ER('Stay! Stay the night! It’s the best party in the Land of the Dead. It’s my party, so it would be.'),
        N('Fireworks go up from the roof, and Miguel is laughing. Ernesto has his arm round him, and the cameras are flashing.'),
        N('Your Nubbin, dripping, sits by your feet and watches Ernesto, and doesn’t clap.'),
        N('You find you aren’t clapping either. You couldn’t say why.'),
      ],
    },
    rewards: [],
    sets: { 'a7-08': true },
    notes:
      'Ernesto is charming and warm here; the player should half like him. Your Nubbin’s quiet distrust is the only ' +
      'hint. The pool rescue echoes one of Ernesto’s own films (playing on the wall): stage it so the parallel shows. ' +
      'Nobody is in danger: the pool is shallow at the steps, the splash is comic.',
  },

  // ---------------------------------------------------------------- A7-9
  {
    id: 'a7-09',
    code: 'A7-9',
    title: 'The Truth',
    source: 'Coco (2017): the stolen songs, and what happened to Héctor',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-8') },
    requires: ['A7-8'],
    speakers: [MIGUEL, HECTOR, ERNESTO],
    steps: [
      {
        id: 'a7-09-s1',
        goal: 'Watch Ernesto’s old films with Miguel, and see who walks in.',
        hint: 'Sit with Miguel in the film room off the party.',
        check: 'watch:a7-ernesto:screening',
        scene: {
          id: 'a7-09-films',
          lines: [
            N('In a room of velvet chairs, Ernesto shows Miguel his old films. Miguel knows every line, and Ernesto is delighted.'),
            N('Then the door opens. It is Héctor, soaking, with a torn jacket, and very out of breath.'),
            H('Ernesto. Old friend.'),
            ER('Héctor? What are you doing here? Who let him in?'),
            H('The boy. He has to put my photo up. You promised me, years ago. You said you’d take my songs and my name with you.'),
            H('You took the songs. You left the name.', 'angry'),
            M('Your songs? What does he mean, your songs?', 'think'),
            N('On the screen, one of Ernesto’s old films is playing: a scene of two friends and a farewell toast with two glasses.'),
          ],
        },
        done: {
          id: 'a7-09-films-done',
          lines: [
            N('Héctor stops. He stares at the screen, and watches the glasses chink.'),
            H('I know this. I know this. This is how it went. Only that’s not quite how it went.', 'shock'),
          ],
        },
      },
      {
        id: 'a7-09-s2',
        goal: 'Hear Héctor remember the night he died.',
        hint: 'Stand by Miguel and listen. Keep your Nubbin close.',
        check: 'inspect:a7-memory:toast',
        scene: {
          id: 'a7-09-toast',
          lines: [
            H('I was going home. I’d had enough. I missed my little girl. I packed my guitar and my songs, and I told you I was going.'),
            H('You poured us a drink. One for the road, you said. And I never got home.', 'shock'),
            N('Ernesto doesn’t say anything. His face says it for him.'),
            M('You… you put something in his drink.', 'shock'),
            H('You took my guitar. You took my songs. You took my whole life and sang it, and you let them forget me.', 'angry'),
            ER('I did what I had to do. Anyone would have. And look. Look what I made of them.'),
            N('He says it like a man explaining the weather. It is the most frightening thing you have seen all night.'),
            N('He lifts Héctor’s little photo out of Miguel’s pocket and tucks it inside his white jacket.'),
            ER('Guards. Take them away. The boy too. He’s seen too much.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand in front of Miguel.',
              then: [N('You step in front of Miguel. It doesn’t stop anything, but it means he isn’t alone when the guards come.')],
            },
            {
              id: 'photo',
              label: 'Grab for Héctor’s photo.',
              then: [N('Ernesto is quicker. He steps back out of reach, pats his jacket, and smiles.')],
            },
          ],
        },
        done: {
          id: 'a7-09-toast-done',
          lines: [
            N('The guards march you all out, through a back door and down a long stair, to a deep round hole in the ground.'),
            N('Dante, out in the gardens, sees you go, and starts to bark and bark and bark.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-09-complete',
      lines: [
        N('The guards drop Miguel and Héctor into the hole. You jump after them, because you said you would stay with Miguel.'),
        N('Your Nubbin jumps after you, glowing all the way down like a dropped lantern.'),
        N('You land in cold water. Far above, the circle of sky closes, and goes dark.'),
        M('This is the worst party I have ever been to.', 'shock'),
        N('Your Nubbin surfaces wearing a marigold, and looks deeply offended about it.'),
      ],
    },
    rewards: [],
    sets: { 'a7-09': true },
    notes:
      'The poisoning is said once, plainly (“you put something in his drink”) and never shown: we see the film-' +
      'within-the-film toast and Héctor’s memory in his face. For the Learning Grove version, soften further. ' +
      'Ernesto’s menace is in his calm, not in violence. The cenote is reached by a fall into water; nobody is hurt.',
  },

  // ---------------------------------------------------------------- A7-10
  {
    id: 'a7-10',
    code: 'A7-10',
    title: 'The Cenote',
    source: 'Coco (2017): the cenote, and who Héctor really is',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-9') },
    requires: ['A7-9'],
    speakers: [MIGUEL, HECTOR, IMELDA],
    steps: [
      {
        id: 'a7-10-s1',
        goal: 'Find a way round the dark cenote, and find Héctor.',
        hint: 'Your Nubbin’s glow lights the way. Follow the rock ledge round the water.',
        check: 'explore:a7-cenote:dark',
        scene: {
          id: 'a7-10-dark',
          lines: [
            N('The cenote is a deep round well of stone, with a pool of black water at the bottom. The walls go straight up.'),
            N('The only light is your Nubbin. Its painted stripes glow pink and green on the wet rock.'),
            M('Héctor? Héctor!'),
            N('You find him sitting on a ledge at the edge of the water, his hat in his hands.'),
            H('All this time. I thought I was just unlucky. I thought I’d slipped on the road home or something stupid.', 'sad'),
            H('He took the songs. Fine. Songs are songs. But I never got home to my girl.'),
            M('Your girl?'),
            H('My daughter. She was this high. She had a laugh like a hiccup. I wrote her songs. One every night, almost.', 'soft'),
            H('Coco. Her name’s Coco.', 'soft'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look at Miguel.',
              then: [N('Miguel’s face has gone white under the last of the paint. He is holding his breath.')],
            },
            {
              id: 'ask',
              label: 'Ask Héctor about her.',
              then: [H('She’d be old now. Very old. Nearly as old as me, which is a joke, because I’m dead.', 'soft')],
            },
          ],
        },
        done: {
          id: 'a7-10-dark-done',
          lines: [
            N('Miguel goes absolutely still. He takes the old family photo out of his pocket: Imelda, the little girl, and a man with no face.'),
            M('Mamá Coco. That’s Mamá Coco. You’re… the man in the photo. You’re my great-great-grandfather.', 'shock'),
            H('I’m your what?', 'shock'),
          ],
        },
      },
      {
        id: 'a7-10-s2',
        goal: 'Sit with Héctor and Miguel by the water.',
        hint: 'Sit down on the ledge with them. There’s no rush now.',
        check: 'sit:a7-hector:water',
        scene: {
          id: 'a7-10-water',
          lines: [
            N('For a while, nobody says anything. Héctor and Miguel just look at each other, as if they are learning a song by heart.'),
            H('You play like me. I knew it. Tonight on the stage. I knew it, and I didn’t know what it was.', 'soft'),
            M('She remembers you. Mamá Coco. She still asks for you. She asks if her papá is coming home.'),
            H('She still asks?', 'sad'),
            N('His hand shines gold at the edges, brighter than ever. He holds it up and looks through it at the water.'),
            H('Not for long, though. She’s fading up there. So I’m fading down here. It’s the same thing.', 'sad'),
            N('Your Nubbin climbs onto Héctor’s knee. Its orange ribbon, with his name stitched crooked on it, catches the glow.'),
            H('Look at that. Still there. Still mine. Somebody wrote me down.', 'soft'),
            N('He touches the letters, one at a time, as if checking the spelling.'),
          ],
        },
        done: {
          id: 'a7-10-water-done',
          lines: [
            H('If I go before you get home. Tell her. Tell her her papá was coming home. He was on his way.', 'sad'),
            M('You tell her. You’re coming too.'),
          ],
        },
      },
      {
        id: 'a7-10-s3',
        goal: 'Watch for help from above.',
        hint: 'Look up at the rim of the cenote. Something is coming.',
        check: 'watch:a7-dante:glow',
        scene: {
          id: 'a7-10-glow',
          lines: [
            N('Far above, there is barking. A long, joyful, ridiculous bark that you would know anywhere.'),
            N('Dante’s face appears at the rim. Then the whole of him starts to shine.'),
            N('Colour sweeps over him like a wave: blue, pink, green, gold, in swirls and dots. Wings open on his back, small and bright.'),
            M('Dante! Dante’s a real alebrije! You were a spirit guide the whole time?', 'happy'),
            N('Your Nubbin answers the light. Its colours flare up all at once, every stripe and spot alight, its little wings glowing.'),
            N('Then a huge shape drops over the rim: a winged cat as big as a horse, painted every colour there is, with Mamá Imelda on her back.'),
            I('Pepita. Down. Gently.'),
            N('The great alebrije lands on the ledge. Mamá Imelda looks at Miguel, and then at Héctor, for a long, long time.'),
            I('You.', 'angry'),
            H('Hola, Imelda.', 'soft'),
          ],
        },
        done: {
          id: 'a7-10-glow-done',
          lines: [
            M('He didn’t leave you, Mamá Imelda. He was coming home. Ernesto stopped him.'),
            N('Mamá Imelda says nothing. But she holds out her hand, and pulls Héctor up onto Pepita’s back behind her.'),
            I('We are going to get that photo back. And then we will talk, you and I.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-10-complete',
      lines: [
        N('Pepita rises out of the cenote in great slow wingbeats, with all of you clinging on.'),
        N('Your Nubbin rides on Dante’s back, both of them blazing with colour, both of them very pleased with themselves.'),
        N('Below, the city glitters. Ahead, the sky over the Land of the Dead is starting, very faintly, to go grey.'),
      ],
    },
    rewards: [
      {
        id: 'a7-alebrije-colour',
        kind: 'cosmetic',
        label: 'Alebrije Colours',
        description:
          'A Nubbin colour from the Marigold Bridge: painted stripes and dots in pink, green, gold and blue, which glow softly at dusk.',
      },
    ],
    sets: { 'a7-10': true },
    notes:
      'NAME PAYOFF (a7-name, A7-6). The step scene shown, a7-10-water, is for ribbon: the stitched name catches the ' +
      'light. For promise play ATLAS_A07_VARIANTS a7-10-water-promise in its place (same check, same done). ' +
      'Dante’s change: our own swirls, not the film’s. Pepita is a giant winged jaguar alebrije; she never talks. ' +
      'Your Nubbin’s alebrije change completes here. Reward: alebrije colours, one-time; a palette in the Grove ' +
      'colour list, with a soft dusk glow.',
  },

  // ---------------------------------------------------------------- A7-11
  {
    id: 'a7-11',
    code: 'A7-11',
    title: 'The Blessing',
    source: 'Coco (2017): the Sunrise Spectacular, and Imelda’s choice',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-10') },
    requires: ['A7-10'],
    speakers: [MIGUEL, HECTOR, IMELDA, ERNESTO, JULIO, ROSITA, TWINS],
    steps: [
      {
        id: 'a7-11-s1',
        goal: 'Sneak backstage at the Sunrise Spectacular with the Rivera family.',
        hint: 'Keep close to the family, behind the stage flats, while Mamá Imelda goes on.',
        check: 'escort:a7-family:backstage',
        scene: {
          id: 'a7-11-backstage',
          lines: [
            N('Ernesto’s great dawn concert, the Sunrise Spectacular, fills a stadium. Thousands of the dead are waiting for him.'),
            N('The whole Rivera family slips in through the back, in borrowed costumes: the twins are both ends of a pantomime horse.'),
            JU('Find the photo. Find Ernesto. Get the photo. Get out. Simple.'),
            TW('We are the back end. We don’t know where we’re going.'),
            RO('And nobody eat anything from the buffet. We are in disguise.'),
            N('A stage manager grabs Mamá Imelda by the arm, thinking she is the next act, and pushes her out into the lights.'),
            I('I… I don’t…', 'shock'),
            N('She stands in front of thousands of people. She hasn’t sung in a hundred years.'),
            N('Then Héctor, in the wings, starts to play an old tune they both know. Mamá Imelda closes her eyes, and sings.'),
            N('It is an old song, slow and fierce. The whole stadium goes quiet to hear it.'),
          ],
        },
        done: {
          id: 'a7-11-backstage-done',
          lines: [
            N('When the song ends, Mamá Imelda looks into the wings at Héctor. Something in her face has come undone, just a little.'),
            I('Don’t. Don’t say anything. Not yet.', 'soft'),
            H('I wasn’t going to say anything.'),
            I('You were. You had your told-you-so face on.'),
            H('Imelda, I barely have a face.'),
            I('You have exactly the same one. That’s always been the trouble.', 'soft'),
          ],
        },
      },
      {
        id: 'a7-11-s2',
        goal: 'Watch Ernesto in front of the cameras.',
        hint: 'Stay behind the scenery and watch the big screens.',
        check: 'watch:a7-ernesto:confession',
        scene: {
          id: 'a7-11-screens',
          lines: [
            N('Ernesto catches Miguel by the stage door. He doesn’t know a camera crew is filming everything for the big screens.'),
            ER('Your great-great-grandfather is nobody. I am somebody. And I’ll do whatever it takes to stay somebody.', 'angry'),
            ER('I did it to him. I’ll do it to you. Nobody will ever know.'),
            N('Every screen in the stadium is showing his face. Thousands of the dead have heard every word.'),
            N('The crowd starts to boo. Then they start to throw things: shoes, fruit, a whole tray of pan de muerto.'),
            N('Somewhere above, a great bell knocked loose in the scuffle swings once, and comes down. Ernesto is under it, stuck, and very cross.'),
            N('In the scramble, Héctor’s photo slips out of Ernesto’s jacket and flutters down into the water by the stage. It is gone.'),
            M('No. No! The photo!', 'sad'),
          ],
        },
        done: {
          id: 'a7-11-screens-done',
          lines: [
            N('Héctor stumbles. The gold light is all over him now, and you can see the stage through his arm.'),
            H('It’s all right, chamaco. It’s all right. It’s my fault for being forgettable.', 'sad'),
          ],
        },
      },
      {
        id: 'a7-11-s3',
        goal: 'Before sunrise, Miguel needs a blessing. Speak up for him.',
        hint: 'Go to Mamá Imelda on the ledge and choose what you plead for.',
        check: 'choose:a7-plea:blessing',
        scene: {
          id: 'a7-11-blessing',
          lines: [
            N('On a ledge above the city, at the edge of the dawn, the family gather round Miguel. His hands are almost all bone now.'),
            N('Héctor is barely there. He is a shape of gold light in a shabby jacket.'),
            M('If I go back and Mamá Coco forgets him, he’s gone. I have to go back. I have to make her remember.', 'sad'),
            I('Miguel.', 'soft'),
            N('Mamá Imelda takes a marigold petal from her shawl. She looks at it, and at Miguel, and then at you.'),
            I('You came all this way with him. You watched him. Tell me. What blessing should I give?'),
          ],
          choices: [
            {
              id: 'free',
              label: '“Bless him with no conditions. Let him go home as he is.”',
              set: { 'a7-plea': 'free' },
              then: [
                I('No conditions. Yes. That’s what a blessing is. I forgot.', 'soft'),
                I('Miguel, I give you my blessing. No conditions. Go home.'),
              ],
            },
            {
              id: 'both',
              label: '“Bless him, and bless Héctor too. Let him come home.”',
              set: { 'a7-plea': 'both' },
              then: [
                I('Héctor. You. I never forgave you.', 'sad'),
                I('Miguel, I give you my blessing. No conditions. Go home, and bring your papá Héctor home with you, in every way you can.'),
                N('Héctor laughs, softly, a sound like someone very surprised to be given a present.'),
              ],
            },
            {
              id: 'sit',
              label: 'Say nothing. Sit beside Miguel, and let him ask.',
              set: { 'a7-plea': 'sit' },
              then: [
                N('You sit down next to Miguel on the ledge, and wait, and your Nubbin sits too. Mamá Imelda watches you both.'),
                M('Please, Mamá Imelda. Just… let me go. I’ll make her remember. I promise.'),
                I('Then go, mijo. My blessing. No conditions. None.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a7-11-blessing-done',
          lines: [
            N('The petal glows in Miguel’s hand. The whole family gives him their blessing then, all together, one after another.'),
            H('Go. Go on, chamaco. Go home.', 'soft'),
            N('The sun comes up over the edge of the world. Gold petals swirl round Miguel, and round you, and round your bright Nubbin.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-11-complete',
      lines: [
        N('The atlas in your pocket goes warm. The Land of the Dead turns to petals, and the petals turn to morning.'),
        N('You are on your knees on the cold floor of Ernesto’s tomb. Miguel is beside you, with the white guitar in his arms.'),
        N('Your Nubbin is beside you too, blue again, mostly. There is still a little pink at the tips of its ears.'),
        M('Mamá Coco. Come on. Come on, quick!'),
      ],
    },
    rewards: [],
    sets: { 'a7-11': true },
    notes:
      'PLEA (a7-plea, set in a7-11-blessing): free | both | sit. Mamá Imelda gives the blessing with no conditions ' +
      'every way, as in the film: the hero’s story is unchanged, and the plea changes only her words and the ' +
      'epilogue in A7-12 (a7-12-complete / -both / -sit). The “sit” plea acts out Hazel’s third rule; never quote ' +
      'it. Imelda’s old song is described, never sung (no lyrics; it is a folk song, but we use none of its words). ' +
      'Ernesto’s fall is a comic bell pratfall; nobody is hurt. Sunrise is a story beat, not a timer.',
  },

  // ---------------------------------------------------------------- A7-12
  {
    id: 'a7-12',
    code: 'A7-12',
    title: 'Remember',
    source: 'Coco (2017): Miguel sings to Mamá Coco',
    audience: 'all',
    trigger: { where: WHERE, when: after('A7-11') },
    requires: ['A7-11'],
    speakers: [MIGUEL, ABUELITA, ENRIQUE, COCO],
    steps: [
      {
        id: 'a7-12-s1',
        goal: 'Run home with Miguel through the waking town.',
        hint: 'Follow Miguel down from the cemetery to the Riveras’ gate.',
        check: 'escort:a7-miguel:home',
        scene: {
          id: 'a7-12-home',
          lines: [
            N('The cemetery is full of families waking up on their blankets, candles burnt down, marigold petals everywhere.'),
            N('Miguel runs through the square, past the statue, which has a pigeon on its head. Nobody stops to look at it now.'),
            N('At the Riveras’ gate, the whole family is out in the street: his father, his mother, Abuelita, cousins, aunts.'),
            EN('Miguel!', 'shock'),
            N('His father holds him so tight that Miguel’s feet come off the ground. Abuelita holds them both.'),
            AB('Where were you? Where were you? We looked all night.', 'sad'),
            M('I’m sorry. I’m sorry. I have to see Mamá Coco. Right now. Please.'),
            N('Abuelita sees the guitar, and her face goes hard. Then she sees Miguel’s face, and her own face stops being hard.'),
          ],
          choices: [
            {
              id: 'dante',
              label: 'Nod at the door: let him go in.',
              then: [N('Abuelita follows your look to the door, and to the little room beyond it where Mamá Coco sits.')],
            },
            {
              id: 'arm',
              label: 'Offer Abuelita your arm.',
              then: [AB('Hm. Visitors. Always carrying something.', 'soft'), N('She takes your arm anyway, and holds on tighter than she means to.')],
            },
          ],
        },
        done: {
          id: 'a7-12-home-done',
          lines: [
            AB('Go. Go to her. Quickly.', 'soft'),
            N('Dante gets through the door first, as usual. Nobody tells him off.'),
          ],
        },
      },
      {
        id: 'a7-12-s2',
        goal: 'Sit with Mamá Coco by the ofrenda.',
        hint: 'Go to Mamá Coco’s chair and sit down beside her.',
        check: 'sit:a7-coco:ofrenda',
        scene: {
          id: 'a7-12-coco',
          lines: [
            N('Mamá Coco is in her chair in her room, with the curtains half drawn. She is looking at nothing at all.'),
            M('Mamá Coco? Mamá Coco, it’s me. It’s Miguel.'),
            N('She doesn’t answer, and her eyes don’t move. Miguel’s face crumples.'),
            M('Please. You have to remember your papá. If you forget him, he’ll be gone. Gone for good.', 'sad'),
            N('Your Nubbin climbs into Mamá Coco’s lap and settles there. Her hand comes down, very slowly, on its back.'),
            N('Her fingers find the orange ribbon round its neck. They find the crooked letters stitched there, and stop.'),
            CO('H… Hé…', 'think'),
            N('She runs her thumb over the letters again and again, like a person reading in the dark.'),
          ],
        },
        done: {
          id: 'a7-12-coco-done',
          lines: [
            N('Miguel looks at Mamá Coco’s moving lips, and then at you, and he picks up the guitar.'),
            M('Mamá Coco. Your papá wrote you a song. I’m going to sing it for you.', 'soft'),
          ],
        },
      },
      {
        id: 'a7-12-s3',
        goal: 'Listen while Miguel sings to Mamá Coco.',
        hint: 'Stay by Mamá Coco and listen. Everyone else will come to the door.',
        check: 'watch:a7-miguel:song',
        scene: {
          id: 'a7-12-song',
          lines: [
            N('Miguel sings the lullaby Héctor wrote for his little girl, with the guitar soft underneath. It is slow and simple, a song for a bedside.'),
            N('One by one, the family come to the doorway. Abuelita opens her mouth to say no, and then she doesn’t.'),
            N('Mamá Coco’s eyes move, and find Miguel. They fill with light, the way a window does when someone comes home.'),
            CO('Papá…', 'soft'),
            N('And then, in a thin, cracked, perfectly true voice, she begins to sing along.'),
            N('Abuelita has her hand over her mouth. Miguel’s father is crying without trying to hide it.'),
            N('When the song ends, Mamá Coco opens the drawer of her bedside table, and takes out a folded scrap of paper.'),
            N('It is a corner of an old photograph: a smiling man with a moustache, and a guitar. It fits the torn photo exactly.'),
            CO('I kept him. I kept him all this time. Papá used to sing to me.', 'happy'),
          ],
        },
        done: {
          id: 'a7-12-song-done',
          lines: [
            N('Miguel fits the corner back into the old photo. It is mended: a family of three, all their faces showing.'),
            N('You untie the orange ribbon from your Nubbin’s neck, with HÉCTOR stitched on it, and tie it round the mended photo.'),
            CO('There. Now he won’t get lost.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a7-12-complete',
      lines: [EPI_START, RIBBON_OFRENDA, ...EPI_COCO, ...FREE_BODY, EPI_HOME],
    },
    rewards: [
      {
        id: 'a7-ofrenda',
        kind: 'decor',
        label: 'The Grove Ofrenda',
        description:
          'A stepped altar of marigolds, candles, water, salt and pan de muerto, where you can set a photo of each Nubbin who has gone. Their stories go on the Remembering Tree; their faces go here.',
      },
      {
        id: 'a7-remembering-bookmark',
        kind: 'item',
        label: 'Night of Remembering Bookmark',
        description: 'A strip of cut paper in marigold orange. It marks the Marigold Bridge page, and counts towards the Night of Remembering.',
      },
    ],
    sets: { 'a7-12': true, 'a7-done': true },
    notes:
      'NAME PAYOFF (a7-name, A7-6; six quests on). Default scenes are for ribbon: Coco finds the stitched name in ' +
      'a7-12-coco, and in a7-12-song-done you tie the ribbon round the mended photo. For promise play ' +
      'ATLAS_A07_VARIANTS a7-12-coco-promise in place of a7-12-coco (you say Héctor’s name aloud to Coco before ' +
      'Miguel sings) and a7-12-song-done-promise in place of a7-12-song-done. a7-12-coco-done plays either way. ' +
      'PLEA PAYOFF (a7-plea, A7-11). The complete scene shown, a7-12-complete, is for free. For both play ' +
      'ATLAS_A07_VARIANTS a7-12-complete-both; for sit play a7-12-complete-sit. In the promise route, “the ribbon ' +
      'still tied round the frame” must not play: each complete scene therefore has a -promise twin ' +
      '(a7-12-complete-promise, a7-12-complete-both-promise, a7-12-complete-sit-promise) that swaps only the second line. ' +
      'Coco’s death is said once, plainly, with comfort straight after (canon tone). The lullaby is described and ' +
      'never sung; Coco “sings along” with no words shown. Rewards are one-time. ' +
      'SIM: (a) the Grove ofrenda is a decor piece with photo slots: one per departed Nubbin, filled from the ' +
      'Grove save’s departure records (read-only; the Atlas writes nothing to the Grove). The player can choose ' +
      'which photo goes where; nothing decays or needs tending (no chores). It is distinct from the Remembering ' +
      'Tree (canon 35): photos here, stories there. (b) The bookmark is an atlas item; the Night of Remembering ' +
      'festival reads atlasDone(\'A7\').',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Where each one plays:
 *   - a7-10-water-promise: a7-name = promise; replaces a7-10-water (A7-10, step 2).
 *   - a7-12-coco-promise: a7-name = promise; replaces a7-12-coco (A7-12, step 2).
 *   - a7-12-song-done-promise: a7-name = promise; replaces a7-12-song-done (A7-12, step 3 done).
 *   - a7-12-complete-both / -sit: a7-plea = both / sit, a7-name = ribbon; replace a7-12-complete.
 *   - a7-12-complete-promise / -both-promise / -sit-promise: a7-name = promise, with a7-plea = free /
 *     both / sit; replace a7-12-complete.
 * Both flags are always set before they are read (their choices must be made to finish A7-6 and
 * A7-11). If either is somehow unset, play the defaults: a7-name as ribbon, a7-plea as free.
 */
export const ATLAS_A07_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A7-10, step 2 (promise)
  {
    id: 'a7-10-water-promise',
    lines: [
      N('For a while, nobody says anything. Héctor and Miguel just look at each other, as if they are learning a song by heart.'),
      H('You play like me. I knew it. Tonight on the stage. I knew it, and I didn’t know what it was.', 'soft'),
      M('She remembers you. Mamá Coco. She still asks for you. She asks if her papá is coming home.'),
      H('She still asks?', 'sad'),
      N('His hand shines gold at the edges, brighter than ever. He holds it up and looks through it at the water.'),
      H('Not for long, though. She’s fading up there. So I’m fading down here. It’s the same thing.', 'sad'),
      N('He looks across at you. You say his name, just once, quietly: Héctor.'),
      H('Still got it, eh? The promise. Still in there.', 'soft'),
      N('The gold at his edges dims, just a little, for just a moment. As if one more person holding on makes a difference.'),
    ],
  },
  // ---------------------------------------------------------------- A7-12, step 2 (promise)
  {
    id: 'a7-12-coco-promise',
    lines: [
      N('Mamá Coco is in her chair in her room, with the curtains half drawn. She is looking at nothing at all.'),
      M('Mamá Coco? Mamá Coco, it’s me. It’s Miguel.'),
      N('She doesn’t answer, and her eyes don’t move. Miguel’s face crumples.'),
      M('Please. You have to remember your papá. If you forget him, he’ll be gone. Gone for good.', 'sad'),
      N('You promised. So you kneel down by her chair, and take her hand, and say it clearly, so she can hear.'),
      Y('Héctor. Your papá’s name is Héctor. He was on his way home to you.'),
      N('Her fingers tighten on yours. Her lips move, as if trying the shape of a word she hasn’t said in a long time.'),
      CO('H… Hé…', 'think'),
    ],
  },
  // ---------------------------------------------------------------- A7-12, step 3 done (promise)
  {
    id: 'a7-12-song-done-promise',
    lines: [
      N('Miguel fits the corner back into the old photo. It is mended: a family of three, all their faces showing.'),
      N('Mamá Coco touches the man’s face in the photo, and then she looks at you, as if she knows you from somewhere.'),
      CO('You said his name. Before. You said it first. Thank you.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A7-12 complete (ribbon, both / sit)
  { id: 'a7-12-complete-both', lines: [EPI_START, RIBBON_OFRENDA, ...EPI_COCO, ...BOTH_BODY, EPI_HOME] },
  { id: 'a7-12-complete-sit', lines: [EPI_START, RIBBON_OFRENDA, ...EPI_COCO, ...SIT_BODY, EPI_HOME] },
  // ---------------------------------------------------------------- A7-12 complete (promise, free / both / sit)
  { id: 'a7-12-complete-promise', lines: [EPI_START, PROMISE_OFRENDA, ...EPI_COCO, ...FREE_BODY, EPI_HOME] },
  { id: 'a7-12-complete-both-promise', lines: [EPI_START, PROMISE_OFRENDA, ...EPI_COCO, ...BOTH_BODY, EPI_HOME] },
  { id: 'a7-12-complete-sit-promise', lines: [EPI_START, PROMISE_OFRENDA, ...EPI_COCO, ...SIT_BODY, EPI_HOME] },
];

// =================================================================== lists

export const ATLAS_A07_FLAGS: string[] = [
  'a7-01',
  'a7-02',
  'a7-03',
  'a7-04',
  'a7-05',
  'a7-06',
  'a7-07',
  'a7-08',
  'a7-09',
  'a7-10',
  'a7-11',
  'a7-12',
  'a7-done', // A7-12: the whole page; read by atlasDone('A7') for the Night of Remembering
  'a7-name', // ribbon | promise (a7-06-name): A7-10 and A7-12
  'a7-plea', // free | both | sit (a7-11-blessing): the A7-12 epilogue
];

export const ATLAS_A07_CHECKS: string[] = [
  'explore:a7-santa-cecilia:plaza',
  'carry:a7-marigolds:ofrenda',
  'inspect:a7-ofrenda:photo',
  'visit:a7-hideout:attic',
  'walk:a7-plaza:sign-up',
  'sit:a7-miguel:steps',
  'walk:a7-cemetery:path',
  'climb:a7-mausoleum:window',
  'watch:a7-family:graves',
  'walk:a7-bridge:petals',
  'visit:a7-bridge:departures',
  'wait:a7-reunions:queue',
  'talk:a7-clerk:curse',
  'escort:a7-miguel:streets',
  'talk:a7-hector:alley',
  'visit:a7-chicharron:shantytown',
  'choose:a7-name:hut',
  'craft:a7-disguise:paint',
  'minigame:a7-talent:stage',
  'escort:a7-miguel:backstreets',
  'carry:a7-case:mansion',
  'swim:a7-pool:mansion',
  'watch:a7-ernesto:screening',
  'inspect:a7-memory:toast',
  'explore:a7-cenote:dark',
  'sit:a7-hector:water',
  'watch:a7-dante:glow',
  'escort:a7-family:backstage',
  'watch:a7-ernesto:confession',
  'choose:a7-plea:blessing',
  'escort:a7-miguel:home',
  'sit:a7-coco:ofrenda',
  'watch:a7-miguel:song',
];
