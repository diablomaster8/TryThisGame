/**
 * The Learning Grove, reader band (ages 7–10): Book Three, chapters 9 and 10.
 * Corvin’s Garden and The Long Night, rewritten for children reading alone, with lessons woven in.
 * Source: campaign-book3.ts (BOOK3_SCENES, ids c9-* and c10-*). Rules: EDU-STYLE.md.
 * Every choice is kept, with its original id, flags and friendship; the hard ones are framed so the
 * child can see their cost.
 */
import type { EduCampaign, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

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
const WISP = say('wisp');
/** Everyone singing at once (the Lantern Song). A campaign speaker (BOOK3_SPEAKERS). */
const CHORUS = say('chorus');

const scene =(of: string, lines: Line[], lessons: Lesson[], choices?: Choice[]): EduScene =>
  choices
    ? { id: `reader:${of}`, of, band: 'reader', lines, choices, lessons }
    : { id: `reader:${of}`, of, band: 'reader', lines, lessons };

// ================================================================ chapter 9: Corvin’s Garden

// c9-open and its Collector-route twin c9-open-sold share these (as campaign-book3.ts does).
const C9_ARRIVE: Line[] = [
  N('The road up the valley climbs into frost. It is nearly midwinter, but this frost was here in August too.'),
  N('Ember walks beside you, hands in her pockets. She hasn’t said a word since the bridge.'),
  N('Corvin’s garden is clean, square and silent. Grey Nubbins stand in grey rows. Not one is touching another.'),
];

const C9_GARDEN: Line[] = [
  CORVIN('You came. And you brought Ember, who hates me. That’s fair. I’d have brought someone who hated me.'),
  CORVIN('Look at them. Not one has ever bitten a judge, or run off into the night. Yours can’t say that.'),
  EMBER('Ash is in the third row. She won’t look at me. You did that.', 'angry'),
  CORVIN('I made her a champion, Ember. You made her a pet. Only one of those lasts.'),
  N('Ember’s hands are shaking. Corvin’s are very white, and very still.'),
  N('He keeps the left one pressed flat to his coat, over the breast pocket. Always over the breast pocket.'),
  CORVIN('She’ll have written that I stole from her. I did. She’ll have written that I was cruel. I never was. Not once.', 'think'),
  CORVIN('She came here in the autumn, you know. Stood at my gate for an hour, and never knocked. Then she went back to her strays.', 'think'),
  CORVIN('They never go hungry here. They’re never thrown. They don’t get sick, or lost, or frightened.'),
  CORVIN('Hers ran away. Hers got sick. Hers died in her arms, and she cried on the hill, and called it love.', 'sad'),
  CORVIN('I wanted them safe. I still do. I have never understood why that makes me the villain of her story.'),
  N('Somewhere in the rows, a grey Nubbin sneezes. It does not move. None of the others look round.'),
  N('Every grey eye in the garden is on you, waiting for the next bad thing.'),
];

/** Corvin’s motive (after his “I wanted them safe” line). */
const c9MotiveLesson = (id: string, after: number): Lesson =>
  ({
    id,
    domain: 'literacy',
    skill: 'work out a character’s motive',
    standard: 'RL.3.3',
    kind: 'ask',
    after,
    prompt: [N('Corvin isn’t a cartoon baddie. He has a reason for everything he did. What reason does he give?')],
    options: [
      {
        label: 'He wanted them safe from every hurt',
        best: true,
        reply: [
          N('Yes. He says it himself: “I wanted them safe.” That is his motive, the reason under everything.'),
          N('Here is the hard part. A good wish can still lead someone to do a wrong thing.'),
        ],
      },
      {
        label: 'He hates Nubbins',
        reply: [
          N('It can look like that. But watch how he looks along the rows, like a shelf he dusts every day.'),
          N('He says, “I wanted them safe.” That is his motive. A good wish can still lead to a wrong thing.'),
        ],
      },
      {
        label: 'He just wants to win races',
        reply: [
          N('Winning matters to him. He called Ash a champion. But listen to what he says last.'),
          N('“I wanted them safe.” That is the reason under the reason. A good wish can still lead to a wrong thing.'),
        ],
      },
    ],
    parentNote: 'Worked out why a character acted as he did, using his own words as evidence.',
  });

/** Think question: trust after wrongdoing (after the last garden line). */
const c9TrustLesson = (id: string, after: number): Lesson =>
  ({
    id,
    domain: 'sel',
    skill: 'think about trust and second chances',
    standard: 'CASEL: Responsible decision-making',
    kind: 'ask',
    after,
    prompt: [
      N('Corvin stole from Hazel. He made all these Nubbins grey. Now you have to decide what to do.'),
      N('Before you choose, think: can someone who did wrong be trusted again?'),
    ],
    options: [
      {
        label: 'Yes, if they really change',
        reply: [
          N('That’s a hopeful answer. Change takes time to see, the way Sable trusted you a little more each day.'),
          N('If you tell Corvin the truth, you might find out whether he can change.'),
        ],
      },
      {
        label: 'Only a little at a time',
        reply: [
          N('That’s a careful answer. Hazel wedged the gate so she’d hear him if he ever came back.'),
          N('She never trusted him again all at once. But she never stopped listening for him, either.'),
        ],
      },
      {
        label: 'No. Some wrongs are too big',
        reply: [
          N('That’s an honest answer, and Ember might agree. Ash is still grey.'),
          N('Some trust doesn’t come back, and that’s allowed. You can still choose what is fair for the Nubbins.'),
        ],
      },
      {
        label: 'Only if they say sorry and mean it',
        reply: [
          N('That’s a thoughtful answer. “Sorry” matters most when it comes with putting things right.'),
          N('Watch what Corvin does, not only what he says.'),
        ],
      },
    ],
    parentNote: 'Thought about whether trust can be rebuilt after a wrong, with no single right answer.',
  });

const C9_CHOICES: Choice[] = [
  {
    id: 'confront',
    label: 'Tell him what Hazel wrote. Make him look at them.',
    set: { corvin: 'reconciled' },
    friendship: { ember: 3, luna: 2 },
    then: [
      N('You open Hazel’s notebook and read it to him. “The brown one let me touch her ear. Took two months. Worth it.”'),
      N('He listens with his eyes shut.'),
      CORVIN('…She said that to me once. “Took two months. Worth it.” I told her I didn’t have two months.', 'sad'),
      CORVIN('I was twenty-two. I had nothing but months.', 'sad'),
      N('He opens his eyes. He looks at the third row for a long time.'),
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
      CORVIN('Two hundred Shells. The same as always. A fair price for a champion who no longer wins.'),
      N('You count them out onto the gatepost. The Shells stick to the frost, and you have to peel each one off with your thumb.'),
      N('Ash walks out beside Ember without looking at either of you. She is grey, and she is going home, and both are true.'),
      EMBER('I don’t know how to thank you. I’ll work it out. Give me a few years.', 'soft'),
    ],
  },
  {
    id: 'force',
    label: 'Open every pen. Now.',
    set: { corvin: 'forced', freedByForce: true },
    friendship: { ember: 2, marina: -2, fern: -2 },
    then: [
      N('You throw the latches, one after another. The iron is so cold your fingers stick to it.'),
      N('The grey Nubbins do not move. Nobody ever told them they could.'),
      N('Then Ash takes one step. Then all of them: a grey stampede, pouring past Corvin, past you, into the trees and the dark.'),
      CORVIN('You think you freed them. You scattered them. Half will starve.', 'angry'),
      CORVIN('Hazel would have fed them one at a time for a year. You had an afternoon.', 'angry'),
      N('He might be right about some of it. They are free, and they are out in the cold woods with nobody to feed them.'),
      EMBER('She looked at me. On her way past. She looked at me.', 'soft'),
    ],
  },
];

/* c9-open-sold's own choice set (as campaign-book3.ts): C9_CHOICES with the same ids, sets and friendship, except
 * that bargain also buys back your sold Nubbin on screen. */
const C9_CHOICES_SOLD: Choice[] = C9_CHOICES.map((c) =>
  c.id === 'bargain' && c.then
    ? {
        ...c,
        then: [
          ...c.then.slice(0, 2),
          CORVIN('And that one. Yours, once. The two hundred covers it.', 'think'),
          N('Your old Nubbin walks out behind Ash, with its number still painted on. It doesn’t look at you, but it comes anyway.'),
          ...c.then.slice(2),
        ],
      }
    : c,
);

const C9: EduScene[] = [
  scene(
    'c9-partner',
    [
      N('The night before you go up the valley, a note comes under the door.'),
      N('The paper is thick and expensive. The handwriting is very neat.'),
      N('The envelope is cold, as if it has been kept in a pocket next to something colder.'),
      CORVIN('“Partner. Come up tomorrow. I’d like to show you what your two hundred Shells turned into.”'),
      CORVIN('“It’s doing well. Quiet. Nothing has hurt it since the day you let it go.”'),
      CORVIN('“You understood something that afternoon that Hazel never did. Come and see. C.V.”'),
      N('Partner. A partner is someone you share a plan with. You don’t remember agreeing to any plan.'),
      N('You read it twice. You put it in the drawer, under Hazel’s letter.'),
      N('Then you take it out again, and put it somewhere else.'),
    ],
    [
      {
        id: 'reader:c9-partner-l1',
        domain: 'literacy',
        skill: 'notice what a writer leaves out',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Read Corvin’s note again. He tells you the Nubbin is quiet, and that nothing has hurt it.'),
          N('Good readers notice what a writer does NOT say. What has Corvin left out?'),
        ],
        options: [
          {
            label: 'Whether it is happy',
            best: true,
            reply: [
              N('Yes. Quiet and unhurt, he says. Not happy. Not playing. Not loved.'),
              N('Corvin thinks “safe” is the whole answer. Keep that in mind when you meet him.'),
            ],
          },
          {
            label: 'Whether it is quiet',
            reply: [
              N('Look again: “It’s doing well. Quiet.” He did say that one.'),
              N('What he never says is whether it is happy. Quiet and happy aren’t the same thing.'),
            ],
          },
          {
            label: 'Whether anything has hurt it',
            reply: [
              N('He did say that: “Nothing has hurt it.” He seems very proud of it.'),
              N('What he leaves out is whether it is happy. For Corvin, safe is the whole answer.'),
            ],
          },
        ],
        parentNote: 'Read a short letter closely and spotted what the writer chose not to say.',
      },
    ],
  ),

  scene(
    'c9-open',
    [...C9_ARRIVE, ...C9_GARDEN],
    [c9MotiveLesson('reader:c9-open-l1', 13), c9TrustLesson('reader:c9-open-l2', 15)],
    C9_CHOICES,
  ),

  // Collector route only (soldNubbin && !boughtBack): c9-open plus the Nubbin you sold.
  scene(
    'c9-open-sold',
    [
      ...C9_ARRIVE.slice(0, 2),
      N('Corvin’s garden is clean, square and silent. In the second row, one Nubbin has a number painted on its side. It was yours. It doesn’t look up.'),
      ...C9_GARDEN,
    ],
    [
      {
        id: 'reader:c9-open-sold-l1',
        domain: 'sel',
        skill: 'think question: owning your part in a wrong',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 2,
        prompt: [
          N('That Nubbin in the second row was yours. You sold it to Corvin for two hundred Shells.'),
          N('Corvin did a wrong thing. Did you? There is no wrong answer.'),
        ],
        options: [
          {
            label: 'Yes. I should never have sold it',
            reply: [N('That’s an honest answer, and a brave one. Saying “I got it wrong” is where putting it right begins.')],
          },
          {
            label: 'Not really. I didn’t know what he would do',
            reply: [
              N('That’s a fair point. You didn’t know about the cold, or the rows.'),
              N('Still, it was yours to look after. Not knowing is a reason. It isn’t quite the same as being right.'),
            ],
          },
          {
            label: 'A bit of both',
            reply: [N('That’s a thoughtful answer. Lots of wrong things happen without anyone meaning harm. What matters now is what you do next.')],
          },
        ],
        parentNote: 'Thought about their own part in a wrong, with no single right answer, and that owning it is where putting it right begins.',
      },
      c9TrustLesson('reader:c9-open-sold-l2', 15),
    ],
    C9_CHOICES_SOLD,
  ),

  scene(
    'c9-shard-reconciled',
    [
      N('The garden is empty. Corvin stands by the open gate with his hand flat on his coat.'),
      CORVIN('There’s something else. You’ll have guessed. Hazel guessed years ago, I expect. She always knew where things were.', 'think'),
      N('He takes it out of his breast pocket.'),
      N('It is a flat tin, the kind throat sweets come in, worn to bare metal where a thumb has rubbed it.'),
      N('It is furred with frost. The air round it is so cold it hurts your teeth.'),
      CORVIN('I was Hazel’s apprentice. I dug this up from under her lantern the autumn I was twenty-two. I meant to put it back by spring.', 'sad'),
      CORVIN('I was going to show her it could be done kindly. It can’t. It only does one thing. It does it so quietly you don’t notice.'),
      N('He holds it out. His hand is blue to the wrist.'),
      CORVIN('Take it. Please. Before I think about it.'),
      N('You take it. It is heavier than a tin should be, colder than anything, and very slightly humming.'),
      N('Corvin tucks his empty hand under his arm. He looks surprised, as if he’d forgotten there were other places to keep a hand.'),
      CORVIN('I haven’t been warm in twenty-two years.', 'soft'),
      N('When you look back from the road, he is still standing in his empty garden, hands in his armpits, like a boy told to wait.'),
    ],
    [
      {
        id: 'reader:c9-shard-reconciled-l1',
        domain: 'maths',
        skill: 'add two-digit numbers',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 11,
        prompt: [
          N('Corvin was twenty-two when he dug up the shard. He has carried it for twenty-two years since.'),
          N('How old is Corvin now?'),
        ],
        options: [
          {
            label: '22',
            reply: [
              N('That was his age when he took it. Now add the twenty-two years he carried it.'),
              N('22 + 22: two tens and two tens make four tens. Two and two make four. He is 44.'),
            ],
          },
          {
            label: '44',
            best: true,
            reply: [N('Yes. 22 + 22 = 44. Half his whole life, he has had that tin in his pocket.')],
          },
          {
            label: '42',
            reply: [
              N('Close! Check the ones: 2 + 2 = 4, not 2. Then the tens: 20 + 20 = 40.'),
              N('40 and 4 make 44. Half his whole life, he has had that tin in his pocket.'),
            ],
          },
        ],
        parentNote: 'Added 22 + 22 to work out a character’s age, using tens and ones.',
      },
      {
        id: 'reader:c9-shard-reconciled-l2',
        domain: 'health',
        skill: 'how the body copes with cold',
        kind: 'notice',
        after: 12,
        lines: [
          N('Why is Corvin’s hand blue? When you are very cold, your body keeps its warm blood close to your heart and tummy.'),
          N('That leaves less warmth for fingers and toes. So they get cold first, and can look pale or even bluish.'),
          N('Tucking cold hands into your armpits is a real trick: it is one of the warmest places on you. Then find a grown-up and a warm room.'),
        ],
        parentNote: 'Learned why hands and feet get cold first, and a safe way to warm them.',
      },
    ],
  ),

  scene(
    'c9-shard-bargained',
    [
      N('Ember and Ash are halfway down the road. You turn to follow, and Corvin says your name.'),
      CORVIN('Wait. You’ve paid for the champion. Have the rest.', 'think'),
      N('He takes something from his breast pocket and tosses it to you, the way you’d toss someone their keys.'),
      N('You catch it, and gasp. It is a flat tin, worn to bare metal where a thumb has rubbed it.'),
      N('It is furred with frost. The air round it is so cold it hurts your teeth.'),
      CORVIN('Hazel’s. Or the valley’s. Or nobody’s. I’ve stopped knowing.'),
      CORVIN('Take it. It never worked on anything that mattered.'),
      N('He wipes his empty hand down his coat, hard, as if something has come off on it.'),
      CORVIN('That’s the end of our business. Mind the ice on the road.'),
    ],
    [
      {
        id: 'reader:c9-shard-bargained-l1',
        domain: 'maths',
        skill: 'divide into equal groups',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 0,
        prompt: [
          N('Your two hundred Shells are still on the gatepost, frozen into neat stacks of twenty.'),
          N('How many stacks are there?'),
        ],
        options: [
          {
            label: '10',
            best: true,
            reply: [N('Yes. Count in twenties: 20, 40, 60, 80, 100, 120, 140, 160, 180, 200. Ten stacks.')],
          },
          {
            label: '20',
            reply: [
              N('Twenty stacks of twenty would be 400 Shells. That’s far too many!'),
              N('Count in twenties: 20, 40, 60, 80, 100, 120, 140, 160, 180, 200. Ten stacks.'),
            ],
          },
          {
            label: '100',
            reply: [
              N('A hundred stacks would be a very long gatepost. Let’s count in twenties instead.'),
              N('20, 40, 60, 80, 100, 120, 140, 160, 180, 200. Ten stacks.'),
            ],
          },
        ],
        parentNote: 'Shared 200 into groups of 20 by counting in twenties.',
      },
      {
        id: 'reader:c9-shard-bargained-l2',
        domain: 'sel',
        skill: 'read feelings from actions',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 7,
        lines: [
          N('Corvin talks as if the tin doesn’t matter. But watch his hand. He wipes it hard, as if he wants to be rid of something.'),
          N('Sometimes people act as if they don’t care when they care very much. What someone does can tell you what they feel.'),
        ],
        parentNote: 'Noticed that actions can show feelings that words hide.',
      },
    ],
  ),

  scene(
    'c9-shard-forced',
    [
      N('The last grey tail vanishes into the trees. The pens hang open. The ground is churned to frozen mud.'),
      N('Corvin is on his knees. Somebody knocked him over in the rush. Possibly everybody.'),
      N('Something has fallen from his coat into the frost, and the frost is growing outwards from it as you watch.'),
      N('It is a flat tin, worn to bare metal where a thumb has rubbed it. The air round it hurts your teeth.'),
      CORVIN('Leave that.', 'shock'),
      N('You pick it up. It is so cold it burns, much heavier than a tin should be, and very slightly humming.'),
      CORVIN('Give it back. You don’t know what it is. You don’t know what it’s for.', 'angry'),
      N('He reaches for it. Then he stops with his hand out, and looks at the hand, as if he has never seen it empty.'),
      CORVIN('…No. Keep it. Keep it, and see how long you last.', 'sad'),
      N('Ember takes your arm and walks you to the road. She doesn’t let go until the frost stops crunching under your boots.'),
      EMBER('Whatever that is, don’t let it near Ash. Don’t let it near anyone.', 'angry'),
      N('On the road home, a grey shape is following Ember, three steps behind. Ash. Ember doesn’t look round. She doesn’t dare.'),
    ],
    [
      {
        id: 'reader:c9-shard-forced-l1',
        domain: 'science',
        skill: 'why metal feels colder than wood',
        standard: '2-PS1-1',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Your fingers stuck to the iron latches. The wooden gatepost sat in the same frost all night, but it didn’t grab you.'),
          N('Why does cold metal feel so much colder than cold wood?'),
        ],
        options: [
          {
            label: 'Metal pulls heat out of your hand faster',
            best: true,
            reply: [
              N('Yes. Both are just as cold, but metal carries heat away from your skin much faster than wood does.'),
              N('Damp fingers can even freeze onto very cold metal. That’s why you should never lick a frozen railing!'),
            ],
          },
          {
            label: 'Metal is always colder than wood',
            reply: [
              N('It feels that way! But things left out in the same frost all night end up the same temperature.'),
              N('The difference is that metal carries heat away from your skin much faster. Wood is slow at it.'),
            ],
          },
          {
            label: 'Wood is secretly warm inside',
            reply: [
              N('Ha! Not this wood. It is just as cold as the iron.'),
              N('But metal carries heat out of your hand much faster, so it feels colder. Wood is slow at it.'),
            ],
          },
        ],
        parentNote: 'Compared how metal and wood feel when cold, and learned that metal carries heat away faster.',
      },
      {
        id: 'reader:c9-shard-forced-l2',
        domain: 'sel',
        skill: 'see that a fast choice can help and hurt',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 8,
        lines: [
          N('You opened every pen at once. The Nubbins are out of Corvin’s rows, and that matters.'),
          N('But they ran into cold woods with nobody to feed them. A fast choice can help and hurt at the same time.'),
          N('Hazel’s way was slow: one Nubbin, one meal, one day. Both ways wanted them free. Only one had time to do it gently.'),
        ],
        parentNote: 'Thought about the good and bad results of a quick, forceful choice.',
      },
    ],
  ),

  scene(
    'c9-shard-collector',
    [
      N('The last grey Nubbin disappears into the trees. Every pen hangs open. Corvin stares at them for a long time.'),
      N('Then, of all things, he starts to laugh.'),
      CORVIN('Quick, and nobody asked them. Nobody asked me, either. That’s my way, partner. You’ve just used it on me.', 'think'),
      N('He takes a flat tin out of his breast pocket. It is worn to bare metal where a thumb has rubbed it.'),
      N('It is furred with frost. The air round it is so cold it hurts your teeth.'),
      CORVIN('I’ve carried this for twenty-two years. It’s why my garden was quiet. Nothing in it was ever lost, or hurt, or frightened.'),
      CORVIN('Take it. You’ll want it now. You understand what it’s for. The others never will.', 'soft'),
      N('He presses it into your hands and folds your fingers over it. His fingers are colder than the tin.'),
      CORVIN('With this, they’ll never leave you.'),
      N('It is heavy and humming and so cold it burns. Then, which is worse, it doesn’t. Your hands go numb. It feels like nothing at all.'),
      N('He is smiling, the way he smiled at your gate the first day. He means it as a kindness. That is the worst part.'),
      N('On the road home, a grey shape is following Ember, three steps behind. Ash. Ember doesn’t look round. She doesn’t dare.'),
    ],
    [
      {
        id: 'reader:c9-shard-collector-l1',
        domain: 'health',
        skill: 'numbness is a cold warning',
        kind: 'notice',
        after: 9,
        lines: [
          N('Numb means you can’t feel something. Very cold skin can go numb: it stops sending “cold!” messages to your brain.'),
          N('Numb is not the same as fine. When cold fingers stop hurting, that is the moment to get warm, quickly, and tell a grown-up.'),
        ],
        parentNote: 'Learned that numb fingers in the cold are a warning sign, not a sign that all is well.',
      },
      {
        id: 'reader:c9-shard-collector-l2',
        domain: 'literacy',
        skill: 'understand a character who means well and is wrong',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 10,
        prompt: [N('“He means it as a kindness. That is the worst part.” Why might that be the worst part?')],
        options: [
          {
            label: 'He believes it, so he can’t see the harm',
            best: true,
            reply: [
              N('Yes. Someone who knows they’re doing wrong might stop. Someone who thinks they’re helping keeps going.'),
            ],
          },
          {
            label: 'He is lying about being kind',
            reply: [
              N('Here is the strange thing: he isn’t lying. He truly thinks this is a gift.'),
              N('That is why it’s worse. Someone who thinks they are helping never sees a reason to stop.'),
            ],
          },
          {
            label: 'It isn’t worse. Kind is good',
            reply: [
              N('Usually, yes! Meaning well matters. But Corvin means well and is wrong.'),
              N('Someone who thinks they are helping never sees a reason to stop. That is what makes it worse.'),
            ],
          },
        ],
        parentNote: 'Explored how a character can mean well and still do harm.',
      },
    ],
  ),

  scene(
    'c9-sable',
    [
      N('Sable is waiting at the gate when you get back. She has waited here only once before: the morning you set off for the Hollow.'),
      N('This time she gets up and walks out to meet you.'),
      N('She puts her nose to your coat, to the pocket where the tin is, and breathes in. Long, slow sniffs.'),
      N('You wait for her to flinch, to jump back the way she does from sudden things. She doesn’t.'),
      N('She sits down, and looks at the pocket, and then up at you, for a long time.'),
      LUNA('She knows that cold. She knows it better than any of us ever will.', 'soft'),
      N('You think of the frost round her bed, the summer she came. Luna is right.'),
    ],
    [
      {
        id: 'reader:c9-sable-l1',
        domain: 'science',
        skill: 'animals use smell to understand the world',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 2,
        lines: [
          LUNA('Lots of animals read the world with their noses. A dog can smell things far too faint for any person to notice.', 'soft'),
          LUNA('Sable just read your pocket the way you’d read a letter. She knows what’s in there without opening it.'),
        ],
        parentNote: 'Learned that many animals rely on a powerful sense of smell.',
      },
      {
        id: 'reader:c9-sable-l2',
        domain: 'sel',
        skill: 'imagine how someone else feels',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('The cold in that tin is what made Sable grey. How do you think she feels, smelling it again?')],
        options: [
          {
            label: 'Scared, but staying anyway',
            reply: [N('That’s a kind way to see it. Being scared and staying anyway is a very brave thing to do.')],
          },
          {
            label: 'Calm. She’s used to it',
            reply: [N('That’s an interesting answer. Maybe she has carried that cold so long it doesn’t surprise her any more.')],
          },
          {
            label: 'Worried about you',
            reply: [N('That’s a thoughtful answer. She looks at the pocket, then at you. Maybe she’s worried it will hurt you too.')],
          },
        ],
        parentNote: 'Imagined a character’s feelings from her past and her actions; every answer was valued.',
      },
    ],
  ),

  scene(
    'c9-close',
    [
      MARINA('Whatever you did up there, the valley’s already talking about it.'),
      MARINA('Fern says it was brave. Byte says it was statistically unwise. They’re both right. That’s the trouble with this valley.', 'think'),
      N('On your step is a pie from Fern, still warm, with a note on top: RULE ONE. THE SECOND HALF. THE BIT SHE NEVER DID.'),
      N('Dusk. Your coat is stiff with frost down the side with the tin. Moss is waiting at the foot of the hill. You can see the grass through him.'),
      MOSS('…Show me.'),
      N('You open the tin. Inside, on grey felt, is a shard: a sharp broken piece of something like ice. Dark at the heart. No longer than your thumb.'),
      MOSS('Cinder. She made it to save them. She did save them. That is the trouble with it.', 'sad'),
      MOSS('Hazel made me promise not to tell you where it had gone. She wanted him to walk it down this lane himself. He couldn’t. You did.', 'think'),
      N('For the first time in twenty-two years, all four pieces of the Heartstone are home. Three are asleep. This one is awake.'),
      MOSS('Put it under the long grass, where I laid it. It won’t sleep. It has been awake too long, in a coat, next to a heart.'),
      N('You do. As you kneel, the glass of the dark fourth lantern frosts over, white, from the bottom up.'),
      MOSS('There is one place to unmake it, so it is gone for good: the Wellspring, behind the falls. On the longest night, the spring opens.', 'think'),
      MOSS('Let the other three sleep. Some things you look after by keeping watch. But only a grey one can carry this one close.', 'think'),
      MOSS('The cold has already done its worst to the grey. None of us was grey, back then. We could only break it, and watch.', 'sad'),
      MOSS('…I am grey enough.', 'soft'),
      N('He sits by the long-grass post all night, and you sit with him. By morning the frost has crept halfway to the pond. Three days to go.'),
    ],
    [
      {
        id: 'reader:c9-close-l1',
        domain: 'science',
        skill: 'changes that can and can’t be undone',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 2,
        prompt: [
          MARINA('Here’s a puzzle while the pie cools. Heat and cold change things. Some changes can be undone. Some can’t.'),
          MARINA('Which of these can never be changed back?'),
        ],
        options: [
          {
            label: 'The frost on your coat',
            reply: [
              MARINA('Hang your coat by the fire and the frost melts into water. That one goes back.'),
              MARINA('Fern’s pie can’t. Once it’s baked, no amount of cooling will turn it back into flour and butter and fruit.'),
            ],
          },
          {
            label: 'Fern’s pie, baked in the oven',
            best: true,
            reply: [
              MARINA('Right. Baking changes the pastry for good. You can cool a pie all day and it won’t turn back into flour and butter.'),
              MARINA('Ice is different. Freeze water, melt it, freeze it again. It goes back and forth.'),
            ],
          },
          {
            label: 'The ice on the pond',
            reply: [
              MARINA('Pond ice melts back into water when it warms up. That one goes back and forth.'),
              MARINA('Fern’s pie can’t. Once it’s baked, it won’t turn back into flour and butter, however long it cools.'),
            ],
          },
        ],
        parentNote: 'Sorted heating and cooling changes into ones that can be reversed (melting ice) and ones that can’t (baking).',
      },
      {
        id: 'reader:c9-close-l2',
        domain: 'maths',
        skill: 'multiply to find hours in days',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 15,
        prompt: [N('Three days to go. There are 24 hours in a day. How many hours until the longest night?')],
        options: [
          {
            label: '27',
            reply: [
              N('That adds 3 to 24. But we need three whole days of 24 hours each.'),
              N('24 + 24 + 24: the tens make 60, the fours make 12. 60 + 12 = 72 hours.'),
            ],
          },
          {
            label: '72',
            best: true,
            reply: [N('Yes. 3 × 24 = 72. Seventy-two hours to get ready. It doesn’t sound like many.')],
          },
          {
            label: '48',
            reply: [
              N('48 is two days: 24 + 24. Add one more day.'),
              N('48 + 24 = 72 hours. Seventy-two hours to get ready.'),
            ],
          },
        ],
        parentNote: 'Multiplied 3 × 24 to turn days into hours.',
      },
    ],
  ),
];

// ================================================================ chapter 10: The Long Night (to the edge)

const C10A: EduScene[] = [
  scene(
    'c10-open',
    [
      N('The winter solstice: the longest night of the year. The sun gets up late and low. The pond has a skin of ice, thin as a page.'),
      N('Moss is on the hill, where he sat the first day. When you climb up, you can see the hill through him.'),
      MOSS('Eternals don’t age. We fade. We are made of being remembered, and the ones who remembered me best are mostly flowers now.', 'soft'),
      MOSS('Tonight all four lanterns must be lit, and kept lit, until the sun comes back. The cold will come at them. Let it.'),
      MOSS('It isn’t the light that matters. It’s the gathering. The light is only how people know where to stand.'),
      MOSS('And at the turn of the night, someone takes that tin to the water.', 'think'),
      YOU('You said you were grey enough.'),
      MOSS('I did say that.', 'soft'),
      N('Below, the gate goes: a lift, a push, a squeal. Fern, with a lantern, a flask, and a blanket she has obviously borrowed from a horse.'),
      FERN('I didn’t know what to bring, so I brought everything that was near the door.'),
      N('Then Sparks with wire, Pixel with the timing box wrapped like a baby, Clover with soup, Luna, Dusty with a spade, Nova with snow on her hat.'),
      N('Marina, with rope. Ember, last, with Ash a step behind her heel, grey, looking at nobody. But she came. And Byte, with a clipboard.'),
      BYTE('Statistically, an Eternal that is petted regularly fades sixty per cent slower. I ran the numbers. While believing it was a hoax.', 'think'),
      MOSS('Noted.', 'soft'),
      N('Byte can’t hear him. Byte nods anyway. The sun touches the ridge.'),
      MOSS('Light them.', 'soft'),
    ],
    [
      {
        id: 'reader:c10-open-l1',
        domain: 'science',
        skill: 'why winter nights are long (the Earth’s tilt)',
        standard: '5-ESS1-2',
        kind: 'ask',
        after: 0,
        prompt: [
          N('Today has fewer hours of daylight than any other day this year. Tonight is the longest night. Why?'),
        ],
        options: [
          {
            label: 'The Sun is farther away in winter',
            reply: [
              N('Lots of people think that! But the Earth is actually nearest the Sun in early January. Distance isn’t the reason.'),
              N('The Earth spins on a tilted axis, like a spinning top that leans. In December, our half leans away from the Sun.'),
              N('So the Sun stays low, takes a short path across the sky, and sets early.'),
            ],
          },
          {
            label: 'Our half of the Earth is tilted away from the Sun',
            best: true,
            reply: [
              N('Yes! The Earth spins on a tilted axis, an imaginary line through its middle, and it always leans the same way.'),
              N('In December, the north half leans away from the Sun. The Sun stays low, takes a short path, and sets early.'),
              N('Far away in the south half of the world, it is summer, and today is their longest day.'),
            ],
          },
          {
            label: 'The Sun gets tired in winter',
            reply: [
              N('Ha! It does look like it “doesn’t try very hard” today. But it’s the same Sun all year.'),
              N('What changes is us. The Earth is tilted, and in December our half leans away from the Sun.'),
              N('So the Sun stays low, takes a short path across the sky, and sets early.'),
            ],
          },
        ],
        parentNote: 'Learned that the winter solstice has the longest night because the Earth’s tilted axis leans our half away from the Sun.',
      },
      {
        id: 'reader:c10-open-l2',
        domain: 'sel',
        skill: 'comfort someone who is missing people',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 2,
        prompt: [
          N('Moss means that the friends who loved him best have died. Memorial flowers grow on the hill where they are remembered.'),
          N('How could you help Moss right now?'),
        ],
        options: [
          {
            label: 'Sit with him for a bit',
            best: true,
            reply: [N('Yes. Rule three: when you don’t know what to do, sit down next to them and wait. You sit. He doesn’t say thank you. He leans, a little.')],
          },
          {
            label: 'Tell him to cheer up',
            reply: [
              N('It’s kind to want him happy. But sad feelings don’t switch off when someone tells them to.'),
              N('Sitting with him says, “You’re not alone.” That helps more. So you sit.'),
            ],
          },
          {
            label: 'Change the subject',
            reply: [
              N('Sometimes that helps, later. But he has just said their names out loud. Listening is a gift.'),
              N('So you sit with him, and listen to the quiet.'),
            ],
          },
        ],
        parentNote: 'Chose a caring way to support someone who is grieving.',
      },
    ],
  ),

  scene(
    'c10-sable-watch',
    [
      N('All afternoon, Sable sits by the long-grass post, two steps from where the tin is buried, with her back to it.'),
      N('As if she is guarding it from everyone. Or everyone from it.'),
      N('Clover’s grey blanket is over her back. Clover put it there an hour ago and walked away, and Sable has let it stay.'),
      LUNA('She hasn’t eaten. She won’t come away. I’ve stopped asking.', 'soft'),
      LUNA('She knows what she’s doing. I just sit near, so she knows she isn’t doing it alone.', 'soft'),
      N('So you sit near too. When you don’t know what to do, sit down next to them and wait.'),
    ],
    [
      {
        id: 'reader:c10-sable-watch-l1',
        domain: 'science',
        skill: 'how a blanket keeps warmth in',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          LUNA('A blanket doesn’t make any heat. It keeps Sable’s own warmth from escaping. That’s what insulate means.', 'soft'),
          LUNA('Wool is full of tiny pockets of trapped air, and still air is very slow to let heat through.'),
        ],
        parentNote: 'Learned that blankets insulate by trapping still air, which slows heat escaping.',
      },
      {
        id: 'reader:c10-sable-watch-l2',
        domain: 'sel',
        skill: 'respect an animal’s choice',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Luna has stopped asking Sable to come away. Why might that be the kind thing to do?')],
        options: [
          {
            label: 'Sable has chosen her job, and Luna respects it',
            best: true,
            reply: [N('Yes. Being kind to animals includes letting them choose, when it is safe. Luna stays close instead of pulling.')],
          },
          {
            label: 'Luna has given up on her',
            reply: [
              N('It might look like that. But Luna hasn’t gone anywhere. She is sitting right beside her.'),
              N('She has stopped pulling, not stopped caring. She is letting Sable choose, and staying close.'),
            ],
          },
          {
            label: 'Luna is cross with her',
            reply: [
              N('Listen to her voice: soft, not cross. Luna isn’t angry.'),
              N('She is letting Sable choose, and staying close so Sable isn’t alone.'),
            ],
          },
        ],
        parentNote: 'Thought about respecting an animal’s choices while staying close to support it.',
      },
    ],
  ),

  scene(
    'c10-vigil',
    [
      N('The vigil begins: a whole night of staying awake to keep watch. Four lanterns lit, and people round each post holding their own.'),
      N('The fourth burns low and blue over the buried tin. An hour after dark the first cold comes, and every flame lies down flat.'),
      SPARKS('Hold them! Hands round the glass! Not ON the glass, ROUND it!', 'shock'),
      N('The stream lantern goes out. Pixel’s timing box clicks, and clicks, and gives a small sad beep.'),
      PIXEL('Backup’s frozen. Backup for the backup’s frozen.', 'shock'),
      SPARKS('Then we light it by hand, like the olden days. Fern, matches.'),
      FERN('Why would I have matches?'),
      N('Fern has matches. Fern has, it turns out, everything that was near the door. The stream lantern catches.'),
      BYTE('The waves are about forty minutes apart. I’m saying it out loud because saying it out loud helps. It helps me.', 'think'),
      N('The second cold is worse. The fourth lantern shrinks to a blue bead. Ember wraps her coat round the post and hugs it.'),
      N('Ash presses against her legs. The bead holds. Just. Clover puts her own scarf round Ember’s neck.'),
      EMBER('Nobody say anything.', 'angry'),
      N('Then Luna starts to sing, quietly, the way you sing to something sleeping. By the second line, everyone has it. Even Byte.'),
      LUNA('Slow hands, warm hearts, the gate stuck fast —', 'soft'),
      CHORUS('what’s kept with love is kept to last.', 'soft'),
      N('Up on the hill, Moss is listening. In the lantern light he is a little easier to see. Only a little. You are almost sure.'),
    ],
    [
      {
        id: 'reader:c10-vigil-l1',
        domain: 'maths',
        skill: 'work out a time interval in hours',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 1,
        prompt: [
          BYTE('Data. The sun set at four o’clock. It rises at eight o’clock tomorrow morning.', 'think'),
          BYTE('How many hours must the lanterns burn?'),
        ],
        options: [
          {
            label: '4 hours',
            reply: [
              BYTE('That would be from four to eight in the same evening. We need to go all the way to morning.'),
              BYTE('Four o’clock to midnight is 8 hours. Midnight to eight is 8 more. 8 + 8 = 16 hours.'),
            ],
          },
          {
            label: '12 hours',
            reply: [
              BYTE('Twelve would get us to four in the morning. Still dark. Let’s count on.'),
              BYTE('Four o’clock to midnight is 8 hours. Midnight to eight is 8 more. 8 + 8 = 16 hours.'),
            ],
          },
          {
            label: '16 hours',
            best: true,
            reply: [
              BYTE('Correct. Four to midnight is 8, midnight to eight is 8. Sixteen hours of dark.'),
              BYTE('Which leaves 8 hours of daylight. 16 + 8 = 24. One whole day. The sums are fine. It’s the night that’s long.'),
            ],
          },
        ],
        parentNote: 'Worked out a time interval across midnight (4 pm to 8 am = 16 hours).',
      },
      {
        id: 'reader:c10-vigil-l2',
        domain: 'music',
        skill: 'rhyme and repeated lines in a song',
        standard: 'RL.2.4',
        kind: 'do',
        after: 14,
        check: 'edu:tap:rhyme:fast-last',
        lines: [
          N('Tap the two words in the chorus that rhyme.'),
          N('Fast and last. Songs that rhyme and repeat are easy to remember, even half-frozen, even in the dark.'),
          N('That is why a whole valley can sing one together, without a single song sheet.'),
        ],
        parentNote: 'Found the rhyming words in a song’s chorus and learned why rhyme and repetition help us remember.',
      },
    ],
  ),

  scene(
    'c10-vigil-wisp',
    [
      N('At the edge of the light, in the long grass, there is a thin grey shape with a torn ear.'),
      N('Wisp isn’t watching the lanterns. He is watching the fourth post, and what is buried under it.'),
      N('He covets it. He wants it so badly that his whole thin body leans towards it, the way he once leaned towards Sable’s fruit.'),
      WISP('…warm.', 'soft'),
      N('It is the coldest thing in the Grove. But to Wisp, you realise, it has always looked like the warmest.'),
      CLOVER('Leave him be. He came. That’s something.', 'soft'),
    ],
    [
      {
        id: 'reader:c10-vigil-wisp-l1',
        domain: 'literacy',
        skill: 'see a scene from a character’s point of view',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 4,
        prompt: [N('The stone is freezing. So why does Wisp call it “warm”?')],
        options: [
          {
            label: 'He’s making a joke',
            reply: [
              N('Wisp doesn’t joke much. He means it.'),
              N('To him, the stone looks like the thing he wants most in the world. We see cold. He sees warm.'),
            ],
          },
          {
            label: 'To him, it looks like the thing he wants most',
            best: true,
            reply: [N('Yes. The same stone looks different from where Wisp stands. We see cold. He sees warm. Remember that.')],
          },
          {
            label: 'He can’t feel the cold',
            reply: [
              N('He’s shivering, so he can feel it. That isn’t it.'),
              N('To him, the stone looks like the thing he wants most in the world. We see cold. He sees warm.'),
            ],
          },
        ],
        parentNote: 'Compared their own view of an object with a character’s very different view of it.',
      },
    ],
  ),

  scene(
    'c10-lull',
    [
      N('Some time after the song, deep in the middle of the night, the cold stops coming for a while.'),
      N('Nobody trusts it. Everybody sits down anyway, on whatever is nearest: a bucket, a step, Dusty.'),
      DUSTY('I don’t mind. I’m warm. I’ve been digging.'),
      N('Pixel is asleep across the timing box, cheek on the dial. It beeps softly at every out-breath.'),
      FERN('I brought biscuits. They’ve frozen. You can still suck them.', 'happy'),
      N('The biscuits taste of ginger and lantern smoke. Sparks has four. Nobody counts. Byte counts.'),
      N('Then Byte sits down next to you on the cold grass, holding his clipboard like a hot-water bottle.'),
      BYTE('Can I ask you something unscientific?', 'think'),
      BYTE('If it works, and the morning comes, and the fourth lantern lights, what will have done it? The lanterns? Or us?'),
      BYTE('I can’t design a test. There’s no control group for a night like this.'),
    ],
    [
      {
        id: 'reader:c10-lull-l1',
        domain: 'maths',
        skill: 'solve a two-step word problem',
        standard: '3.OA.D.8',
        kind: 'ask',
        after: 5,
        prompt: [
          BYTE('Fern’s tin held 24 biscuits. Sparks ate 4. The other ten of us share the rest equally.', 'think'),
          BYTE('How many biscuits each?'),
        ],
        options: [
          {
            label: '2 each',
            best: true,
            reply: [BYTE('Correct. 24 − 4 = 20. Then 20 shared by 10 is 2 each. Pixel’s are being saved for when she wakes up.', 'happy')],
          },
          {
            label: '4 each',
            reply: [
              BYTE('Sparks had 4. Everyone else gets fewer. Two steps.'),
              BYTE('First, 24 − 4 = 20 left. Then 20 shared by 10 people is 2 each.'),
            ],
          },
          {
            label: '20 each',
            reply: [
              BYTE('20 is how many are left: 24 − 4. That’s step one. Now share them.'),
              BYTE('20 shared by 10 people is 2 each. Fern’s tin isn’t that big.'),
            ],
          },
        ],
        parentNote: 'Solved a two-step problem: subtracted, then shared equally (24 − 4 = 20; 20 ÷ 10 = 2).',
      },
      {
        id: 'reader:c10-lull-l2',
        domain: 'science',
        skill: 'what makes a fair test',
        kind: 'notice',
        after: 9,
        lines: [
          BYTE('In a fair test, you change just one thing and keep everything else the same.', 'think'),
          BYTE('A control group is the group you leave alone, so you can compare. To test lanterns, I’d need a second Grove: lanterns, no people.'),
          BYTE('We haven’t got a second Grove. So I’m asking you instead.'),
        ],
        parentNote: 'Learned what a fair test and a control group are in a science experiment.',
      },
    ],
    [
      {
        id: 'lull-lanterns',
        label: 'The lanterns. Light is light.',
        friendship: { byte: 1 },
        then: [
          BYTE('Thank you. That’s measurable. I find that very comforting.', 'happy'),
          BYTE('…I don’t believe you. But I find it very comforting.'),
        ],
      },
      {
        id: 'lull-us',
        label: 'Us. The lanterns just show people where to stand.',
        friendship: { byte: 2 },
        then: [
          BYTE('That sounds like something Moss would say. I can’t hear him. I’m starting to think that’s my fault.', 'think'),
          N('He writes it down anyway: one line, slowly, on a clipboard that has frozen to his glove.'),
        ],
      },
      {
        id: 'lull-matter',
        label: 'Does it matter, if the morning comes?',
        friendship: { byte: 1 },
        then: [
          BYTE('Yes. Enormously. To me.', 'think'),
          BYTE('…Not tonight, though. Tonight I’ll take the morning however it comes.', 'soft'),
        ],
      },
    ],
  ),

  scene(
    'c10-falls',
    [
      N('And then, somewhere past the ridge, the falls stop.'),
      N('You have heard them every night since you came, without ever really listening. Now there is nothing. The silence is enormous.'),
      MARINA('That’s it. That’s the turn of the night. The falls are frozen, and the spring is open.', 'think'),
      MARINA('We’ve got till dawn, and the ledge will be ice.'),
      N('Moss comes down the hill. It takes him a long time. Nobody hurries him.'),
      MOSS('The rest of them hold the lanterns. Until the sun’s up. Whatever they hear.', 'think'),
      YOU('Moss says hold them. Till the sun’s up. Whatever you hear.'),
      SPARKS('What would we hear?'),
      N('Moss doesn’t answer that. You don’t pass it on.'),
      N('You kneel at the long-grass post and dig. The tin is frozen into the earth. It comes free with a crack like a knuckle.'),
      N('You open it. The shard lies in its grey felt, and the cold off it makes your eyes stream.'),
    ],
    [
      {
        id: 'reader:c10-falls-l1',
        domain: 'science',
        skill: 'sound is made by vibrations',
        standard: '1-PS4-1',
        kind: 'ask',
        after: 1,
        prompt: [N('Why did the roar of the falls stop?')],
        options: [
          {
            label: 'Frozen water can’t move, so it can’t shake the air',
            best: true,
            reply: [
              N('Yes. Sound is made by vibrations: tiny, fast shakes. Crashing water shakes the air, and the shaking reaches your ears as a roar.'),
              N('Frozen water doesn’t crash. No shaking, no sound.'),
            ],
          },
          {
            label: 'The falls fell asleep',
            reply: [
              N('It does feel like that! But sound is made by vibrations: tiny, fast shakes.'),
              N('Crashing water shakes the air. Frozen water can’t crash. No shaking, no sound.'),
            ],
          },
          {
            label: 'The snow swallowed the sound',
            reply: [
              N('Good thinking: soft, fresh snow really does soak up some sound. But this silence is bigger than that.'),
              N('Sound is made by vibrations. Frozen water can’t crash and shake the air. No shaking, no sound.'),
            ],
          },
        ],
        parentNote: 'Explained that sound comes from vibrations, so frozen (still) water makes no sound.',
      },
      {
        id: 'reader:c10-falls-l2',
        domain: 'literacy',
        skill: 'recognise a simile',
        standard: 'L.4.5',
        kind: 'ask',
        after: 9,
        prompt: [
          N('“A crack like a knuckle.” That is a simile: it compares two things using “like” or “as”.'),
          N('Which of these is also a simile?'),
        ],
        options: [
          {
            label: '“The ledge will be ice.”',
            reply: [N('That one just tells us a fact. No “like” or “as”. The simile is “thin as a page”: the pond ice was compared to paper.')],
          },
          {
            label: '“Thin as a page.”',
            best: true,
            reply: [N('Yes. The pond ice was compared to a page, using “as”. You can almost see through it.')],
          },
          {
            label: '“Nobody hurries him.”',
            reply: [N('That one tells us what people did. No comparison. The simile is “thin as a page”: the pond ice was compared to paper.')],
          },
        ],
        parentNote: 'Identified similes (comparisons using “like” or “as”) in the story.',
      },
    ],
  ),

  scene(
    'c10-bearer-sable',
    [
      N('Moss bends towards the shard. Before he can reach it, something grey steps between you.'),
      N('Sable. She looks at the shard. She looks at Moss. Then she looks at you, the way she looked at your hands the first night.'),
      LUNA('Oh, sweetheart. No.', 'sad'),
      MOSS('…Yes.', 'soft'),
      MOSS('Only the grey can carry it close. I am grey with age. She is grey with what was done to her. That kind goes all the way through.', 'think'),
      MOSS('The cold has already done its worst to her. It has nothing new to do to her. That is the sad part. Tonight it is also the useful part.'),
      N('Sable bends her head and picks up the shard in her mouth, as gently as an egg.'),
      N('She is the bearer now: the one who carries it.'),
      N('The frost runs up her muzzle and stops. She shivers once, all over. She does not go still.'),
      N('Luna crouches and puts her forehead against Sable’s, just for a second. Then she goes back to her lantern without a word.'),
    ],
    [
      {
        id: 'reader:c10-bearer-sable-l1',
        domain: 'science',
        skill: 'how animal parents carry their young',
        standard: '1-LS1-2',
        kind: 'notice',
        after: 7,
        lines: [
          N('Animal mothers carry precious things this way. A cat lifts her kitten by the loose skin at the back of its neck.'),
          N('A mother crocodile carries her tiny hatchlings in her huge jaws, so gently they aren’t hurt.'),
          N('Strong jaws can be gentle jaws. It’s all in how you hold.'),
        ],
        parentNote: 'Learned how some animal parents, like cats and crocodiles, carry their young in their mouths.',
      },
      {
        id: 'reader:c10-bearer-sable-l2',
        domain: 'sel',
        skill: 'understand that brave includes being scared',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 9,
        prompt: [N('Sable shivered. Do you think she was scared?')],
        options: [
          {
            label: 'Yes, and she did it anyway',
            best: true,
            reply: [N('That’s what brave really means. Not “not scared”. Scared, and doing the right thing anyway.')],
          },
          {
            label: 'No. Brave animals don’t get scared',
            reply: [
              N('It’s a nice idea, but even the bravest people and animals feel scared.'),
              N('Brave doesn’t mean “not scared”. It means scared, and doing the right thing anyway. That’s Sable.'),
            ],
          },
          {
            label: 'She was just cold',
            reply: [
              N('She was certainly cold! Maybe scared too. Shivers can be both.'),
              N('Brave doesn’t mean “not scared”. It means scared, and doing the right thing anyway.'),
            ],
          },
        ],
        parentNote: 'Talked about courage as feeling afraid and acting anyway.',
      },
    ],
  ),

  scene(
    'c10-bearer-moss',
    [
      MOSS('Mine. I laid it there. I can carry it the rest of the way.', 'soft'),
      N('He bends and takes it the way you take something out of a fire: quickly, without flinching, because flinching is worse.'),
      N('The frost climbs his face and settles in the creases. He is so faint now that the shard seems to float by itself.'),
      MOSS('There. Not so bad. Briar would have made a joke about it. I can’t think of one.', 'soft'),
      N('Nobody else can hear him. They see an old grey shape with ice on his face and a blue light in his mouth.'),
      N('They stand a little straighter at their lanterns.'),
      N('Moss is the bearer now: the one who carries it.'),
    ],
    [
      {
        id: 'reader:c10-bearer-moss-l1',
        domain: 'literacy',
        skill: 'choose the right meaning of a word',
        standard: 'L.3.4',
        kind: 'ask',
        after: 2,
        prompt: [N('Moss is “so faint now”. Faint has more than one meaning. Which one fits here?')],
        options: [
          {
            label: 'Hard to see, nearly see-through',
            best: true,
            reply: [N('Yes. Faint can mean pale and hard to see. Moss is fading, so the light shows through him.')],
          },
          {
            label: 'Falling down in a dizzy spell',
            reply: [
              N('That’s a real meaning too: “she felt faint and sat down.” But Moss isn’t falling.'),
              N('Here faint means pale and hard to see. Moss is fading, so the light shows through him.'),
            ],
          },
        ],
        parentNote: 'Used context to choose between two meanings of the word “faint”.',
      },
      {
        id: 'reader:c10-bearer-moss-l2',
        domain: 'sel',
        skill: 'courage can spread',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          N('Nobody heard a word Moss said. They just saw him do it. And they stood straighter.'),
          N('Courage spreads. When one person is brave, the people around them can borrow a little.'),
        ],
        parentNote: 'Noticed how one person’s courage can help others feel braver.',
      },
    ],
  ),

  scene(
    'c10-ledge',
    [
      N('Marina leads, with her rope and her lantern. You follow. Behind you comes the stone, carried low, glowing blue through grey fur.'),
      N('Behind all of you the lanterns get smaller, and the singing gets quieter, until it is only something you remember.'),
      N('The falls hang frozen over the cliff: a long white pour of glass, stopped mid-fall. The spray stands in the air like breath.'),
      MARINA('Hands on the rock. Feet where my feet go. Don’t be brave. Brave people fall off.', 'think'),
      N('The ledge is a narrow shelf of ice along the cliff, a hand’s width across.'),
      N('Marina ties the rope round your waist, then her own. The one carrying the stone goes untied: no knot is that small.'),
      MARINA('Hazel came along here every week, the summer I taught hers to swim. Like a goat. Complained the whole way.', 'soft'),
      N('Behind the ice, the cave opens out. The rock glitters. It is warm in here, properly warm, like a kitchen.'),
      N('The Wellspring’s water comes up from deep underground, where the rock is warm. So the cave smells of wet moss and spring.'),
      N('The frost round the rim has drawn back. The water is moving, lit from below by nothing at all.'),
      N('You have never seen anything so old. Moss told you the first Nubbins came up out of this, each a small light. Now you believe him.'),
      MARINA('I’ll stay at the mouth. Somebody has to hold the rope.', 'soft'),
    ],
    [
      {
        id: 'reader:c10-ledge-l1',
        domain: 'science',
        skill: 'water freezes into solid ice',
        standard: '2-ESS2-3',
        kind: 'ask',
        after: 2,
        prompt: [N('A whole waterfall, frozen solid. How cold must water get before it turns to ice?')],
        options: [
          {
            label: '0 °C (32 °F)',
            best: true,
            reply: [
              N('Yes. At 0 °C (32 °F), liquid water starts to freeze into solid ice.'),
              N('The tiny drops of spray freeze first, because a small drop loses its heat fast. The big pour of water takes much longer.'),
            ],
          },
          {
            label: '10 °C (50 °F)',
            reply: [
              N('That’s a chilly day, but water stays liquid. It has to get colder still.'),
              N('Water freezes at 0 °C (32 °F). The tiny drops of spray freeze first, because a small drop loses its heat fast.'),
            ],
          },
          {
            label: '100 °C (212 °F)',
            reply: [
              N('That’s the other end! At 100 °C (212 °F), water boils into steam.'),
              N('Water freezes at 0 °C (32 °F). The tiny drops of spray freeze first, because a small drop loses its heat fast.'),
            ],
          },
        ],
        parentNote: 'Learned that water freezes into solid ice at 0 °C (32 °F) and boils at 100 °C (212 °F).',
      },
      {
        id: 'reader:c10-ledge-l2',
        domain: 'health',
        skill: 'staying safe near ice',
        kind: 'notice',
        after: 5,
        lines: [
          MARINA('Real ice is no joke. Never step onto a frozen pond, river or waterfall unless a grown-up who knows has said it’s safe.', 'think'),
          MARINA('On icy ground: small steps, hands ready, and hold on to something. Or someone.'),
        ],
        parentNote: 'Learned simple rules for staying safe on and near ice.',
      },
    ],
  ),

  scene(
    'c10-edge',
    [
      N('At the water’s edge, the stone stops humming.'),
      N('Then it speaks. Not in words. It doesn’t need words.'),
      N('It shows you the Grove, still. Every Nubbin you have ever loved, sitting quietly in the grass. Never hungry. Never thrown. Never sick.'),
      N('Nothing fades. Nothing runs into the dark. Nobody ever goes up the hill.'),
      N('Safe, it says. Safe, safe. Keep me, and nothing will ever hurt them again. And nothing will ever hurt you through them.'),
      N('It is the kindest voice you have ever heard. It sounds like someone who loved them very much.'),
      N('This is what temptation feels like: a wrong thing that sounds exactly like a kind one.'),
      N('Moss says nothing. He said it all once, by the frozen post at dawn. He is trusting you to remember.'),
    ],
    [
      {
        id: 'reader:c10-edge-l1',
        domain: 'literacy',
        skill: 'understand a story’s theme',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 7,
        prompt: [
          N('What Moss said by the frozen post was this: safe is not the same as well.'),
          N('Look at the Grove the stone is showing you. What is missing from it?'),
        ],
        options: [
          {
            label: 'Nothing. It looks perfect',
            reply: [
              N('It does look peaceful. Look again: nobody plays, nobody runs, nobody grows.'),
              N('Kept safe from every hurt means kept from every joy, too. That is what Moss meant.'),
            ],
          },
          {
            label: 'Playing, running, growing, choosing',
            best: true,
            reply: [
              N('Yes. Being well means being alive: muddy, noisy, loved, and sometimes hurt.'),
              N('The stone can only give “safe”. That is the theme of this whole story: safe is not the same as well.'),
            ],
          },
          {
            label: 'The lanterns',
            reply: [
              N('Maybe! But look at the Nubbins: sitting still, never running, never choosing.'),
              N('Kept safe from every hurt means kept from every joy, too. That is what Moss meant.'),
            ],
          },
        ],
        parentNote: 'Explained the story’s big idea (theme): that being kept safe is not the same as being well.',
      },
    ],
    [
      {
        id: 'unmake',
        label: 'Unmake it.',
        set: { keptStone: false },
        then: [YOU('Unmake it.'), N('You say it out loud, so that it can’t pretend it didn’t hear.')],
      },
      {
        id: 'keep',
        label: 'Keep it. They’d never be hurt again.',
        set: { keptStone: true },
        then: [
          N('You hold out your hand.'),
          N('For a moment nothing happens. Then the stone is given to you, gently, because it has been carried gently all the way here.'),
          N('It isn’t cold. That is the first thing you notice. It isn’t cold at all. Your fingers have gone numb.'),
          MOSS('…Ah.', 'sad'),
          N('That is all he says. He turns and walks back towards the cave mouth, and does not wait for you.'),
          N('Nothing will hurt them now. Nothing will make them laugh, either. That is the price, and you have just paid it.'),
        ],
      },
    ],
  ),
];

// ================================================================ chapter 10: The Long Night (after the edge)

const C10B: EduScene[] = [
  scene(
    'c10-kept',
    [
      N('You walk back along the ledge with the stone in your breast pocket. Your feet don’t slip once.'),
      N('Behind you the falls begin to run again. A ring of frost stays round the spring. You don’t look back.'),
      N('Dawn comes up grey. In the Grove three lanterns are still burning. The fourth, by the long grass, has gone out.'),
      N('The Keepers are still at their posts, swaying, faces raw with cold. They look at you, and wait for you to tell them.'),
      FERN('Well? Is it… is it done?', 'think'),
      N('You find you don’t want to say. You put your hand on your coat instead, over the pocket.'),
      EMBER('…I know that. I know where I’ve seen that.', 'angry'),
      N('Moss goes up the hill without stopping, and sits with his back to the Grove.'),
      N('The frost has gone from the grass. Your hands are cold. They will be cold from now on.'),
      N('When you go to the gate to look down the lane, it swings open before you touch it. It doesn’t make a sound.'),
    ],
    [
      {
        id: 'reader:c10-kept-l1',
        domain: 'literacy',
        skill: 'spot an echo that shows a character changing',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 6,
        prompt: [N('Ember knows where she has seen that before. Who else always kept a hand pressed over his breast pocket?')],
        options: [
          {
            label: 'Corvin',
            best: true,
            reply: [
              N('Yes. Writers use an echo like this, the same small action again, to show a character becoming like someone else.'),
              N('And the gate opening on its own? It did that for Corvin, too.'),
            ],
          },
          {
            label: 'Hazel',
            reply: [
              N('Hazel kept her hands busy with buckets and seeds. Think of the man in the cold garden.'),
              N('It was Corvin. Writers use an echo like this to show a character becoming like someone else.'),
            ],
          },
          {
            label: 'Byte',
            reply: [
              N('Byte keeps his hands on his clipboard. Think of the man in the cold garden.'),
              N('It was Corvin. Writers use an echo like this to show a character becoming like someone else.'),
            ],
          },
        ],
        parentNote: 'Noticed a repeated action that shows a character becoming like another.',
      },
      {
        id: 'reader:c10-kept-l2',
        domain: 'sel',
        skill: 'notice a heavy secret',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 9,
        lines: [
          N('You didn’t want to tell Fern the truth. A secret that makes you hide your hand is a heavy one.'),
          N('When something feels too heavy to say, it is often exactly the thing to tell someone you trust.'),
        ],
        parentNote: 'Thought about how secrets can feel heavy, and that telling a trusted person can help.',
      },
    ],
  ),

  scene(
    'c10-safe-sable',
    [
      N('Sable steps down into the warm water, up to her chest. The gold light comes up round her.'),
      N('She lowers her head to let the stone go. And stops.'),
      N('She can’t. Her jaw won’t open. She stands in the water with the stone in her mouth, shaking, and the frost creeps back up her face.'),
      N('You know what it is telling her.'),
      N('She will never be hungry again. Never cold, never thrown, never waiting in a pen for the next bad thing.'),
      N('It is telling her the one thing nobody else ever promised her.'),
      N('Sable looks at you. And for the first and only time in her life, she speaks.'),
      SABLE('…safe.', 'soft'),
      N('It is the stone’s word. It is in her voice. You will never know which of them meant it.'),
      N('She does not let go.'),
    ],
    [
      {
        id: 'reader:c10-safe-sable-l1',
        domain: 'sel',
        skill: 'understand why letting go is hard',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('Why is it so hard for Sable to let go?')],
        options: [
          {
            label: 'She was hurt for so long that “safe” sounds wonderful',
            best: true,
            reply: [N('Yes. When you have been scared for a long time, a promise of safe can feel like the best thing in the world. Even a false one.')],
          },
          {
            label: 'She is being greedy',
            reply: [
              N('It isn’t greed. Sable has never asked for anything.'),
              N('She was hurt for a long time, and “safe” is the one promise nobody ever made her. That is very hard to put down.'),
            ],
          },
          {
            label: 'She has forgotten what to do',
            reply: [
              N('She knows. She lowered her head to do it. She just can’t.'),
              N('She was hurt for a long time, and “safe” is the one promise nobody ever made her. That is very hard to put down.'),
            ],
          },
        ],
        parentNote: 'Explained a character’s struggle by thinking about her past experiences.',
      },
      {
        id: 'reader:c10-safe-sable-l2',
        domain: 'literacy',
        skill: 'hold an open question in a story',
        standard: 'RL.3.6',
        kind: 'notice',
        after: 8,
        lines: [
          N('Sometimes a writer leaves a question open on purpose. Was it the stone talking, or Sable?'),
          N('Good readers can hold both answers at once. You get to decide what you believe.'),
        ],
        parentNote: 'Learned that stories sometimes leave questions open for the reader to think about.',
      },
    ],
  ),

  scene(
    'c10-safe-moss',
    [
      N('Moss steps down into the warm water. The gold light comes up round him, and through him.'),
      N('He bends his head to let the stone go. And stops.'),
      MOSS('…Oh. It’s her voice. It’s using her voice.', 'shock'),
      MOSS('It sounds like Cinder on the last warm day before the White Year, calling me in out of the rain.', 'sad'),
      MOSS('Safe, she says. Come in where it’s safe. I loved her. I can’t put her down.', 'sad'),
      N('He stands in the water with the stone in his mouth, and the frost creeps back up his face, and he does not move.'),
    ],
    [
      {
        id: 'reader:c10-safe-moss-l1',
        domain: 'literacy',
        skill: 'understand a saying from the story’s world',
        standard: 'L.3.4',
        kind: 'notice',
        after: 3,
        lines: [
          N('In the valley, people have a saying: “cinder-love”. It means a love that holds on too tight.'),
          N('Cinder loved the Nubbins so much she kept them still. Now her voice is asking Moss to hold on too tight as well.'),
        ],
        parentNote: 'Learned the meaning of a saying from the story and connected it to a character’s choice.',
      },
      {
        id: 'reader:c10-safe-moss-l2',
        domain: 'sel',
        skill: 'name the feeling of missing someone',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('Moss misses Cinder. Missing someone you loved can pull at you so hard it feels like a voice calling you home.'),
          N('That feeling is called grief. It is allowed, even for the oldest, wisest ones.'),
        ],
        parentNote: 'Named grief as the feeling of missing someone, and learned it is normal for everyone.',
      },
    ],
  ),

  scene(
    'c10-wisp',
    [
      N('Behind you, on the ledge, something has followed you all the way here. Very quietly, for once in its life.'),
      N('A thin grey shape with a torn ear shoots past your boots like a thrown stone.'),
      WISP('Hsss! Mine!', 'angry'),
      N('He hits the shallows and snatches the shard away, quick as a theft, which it is.'),
      WISP('mine — warm — mine —', 'shock'),
      N('For one moment he holds it: the warmest thing he has ever seen. His whole thin face is joy.'),
      N('Then his back feet slip on the wet stone, and he tumbles into the Wellspring, stone and all. The water closes over him.'),
      N('And the light comes up. Not cold. Warm. Gold, like the inside of a lantern, like a kitchen window seen from a dark road.'),
      N('It fills the cave and the ledge and the frozen falls, and the ice on the falls glows the colour of honey.'),
      N('Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet.'),
      N('In the shallows, the one who carried the stone here stands blinking. The frost is melting off its face, drip by drip.'),
      N('The water is still. And Wisp is gone.'),
    ],
    [
      {
        id: 'reader:c10-wisp-l1',
        domain: 'science',
        skill: 'light passes through clear materials',
        standard: '1-PS4-2',
        kind: 'notice',
        after: 8,
        lines: [
          N('Why does the frozen waterfall turn gold? Clear ice lets light pass through it.'),
          N('When golden light shines through ice, the ice glows gold too. We see things only when light reaches our eyes, and tonight the light is coming from the spring.'),
        ],
        parentNote: 'Learned that light passes through clear materials like ice, which then glow with the light’s colour.',
      },
    ],
  ),

  scene(
    'c10-moss-walks',
    [
      N('Moss wades in beside her. He is so faint now that the gold light shines straight through him.'),
      MOSS('Give it here, grey one. You’ve carried enough.', 'soft'),
      N('He puts his face very close to hers, the way Luna did. Forehead to forehead.'),
      N('And Sable’s jaw opens, and the stone drops. Not to the water. To him.'),
      N('She stumbles out of the shallows and comes to you, soaking, and leans her whole weight against your shin.'),
      MOSS('I laid Cinder’s shard under the long grass. I can take it the rest of the way. That seems fair.', 'think'),
      MOSS('Hold the lantern up, would you. I’d like to see where I’m going.', 'soft'),
      N('You hold it up. Your arm is shaking. You hold it up anyway.'),
      MOSS('I sat beside Hazel for a whole winter before I said a single word to her. She fidgeted. She was very bad at it.', 'soft'),
      MOSS('You aren’t to fidget.', 'happy'),
      N('He walks down into the Wellspring, slowly, the way he walks into everything. The water comes up to his chin. Then over.'),
      N('And the light comes up. Not cold. Warm. Gold, like the inside of a lantern, like a kitchen window seen from a dark road.'),
      N('It fills the cave and the ledge and the frozen falls, and the ice on the falls glows the colour of honey.'),
      N('Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet.'),
      N('When you can see again, the water is still, and lit very faintly from below, and Moss is gone.'),
    ],
    [
      {
        id: 'reader:c10-moss-walks-l1',
        domain: 'literacy',
        skill: 'understand a metaphor',
        standard: 'L.4.5',
        kind: 'ask',
        after: 1,
        prompt: [
          N('“You’ve carried enough.” Sable carried the stone in her mouth. But Moss means something more.'),
          N('What else has Sable carried?'),
        ],
        options: [
          {
            label: 'Her fear and hurt, all her life',
            best: true,
            reply: [
              N('Yes. That is a metaphor: words that say one thing to mean something deeper.'),
              N('Sable has carried the hurt from Corvin’s garden for a long time. Moss is telling her she can put it down.'),
            ],
          },
          {
            label: 'Only the stone',
            reply: [
              N('She did carry the stone. But Moss is using a metaphor: words that say one thing to mean something deeper.'),
              N('Sable has carried the hurt from Corvin’s garden for a long time. Moss is telling her she can put it down.'),
            ],
          },
        ],
        parentNote: 'Understood a metaphor: “carrying” used to mean living with fear and hurt.',
      },
      {
        id: 'reader:c10-moss-walks-l2',
        domain: 'sel',
        skill: 'let someone help',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 4,
        lines: [
          N('Sable couldn’t let go on her own. With Moss close, forehead to forehead, she could.'),
          N('Sometimes the bravest thing is to let someone help you.'),
        ],
        parentNote: 'Recognised that accepting help can be brave.',
      },
    ],
  ),

  scene(
    'c10-moss-walks-bearer',
    [
      N('Moss stands in the water with Cinder’s voice in his mouth. Then, slowly, he turns his head and looks at you.'),
      MOSS('I can’t put her down.', 'sad'),
      MOSS('So I won’t. I’ll carry her home instead. That is what you do, with a friend who has stayed out too late.', 'soft'),
      MOSS('I laid her shard under the long grass. I can take it the rest of the way. That seems fair.', 'think'),
      MOSS('Hold the lantern up, would you. I’d like to see where I’m going.', 'soft'),
      N('You hold it up. Your arm is shaking. You hold it up anyway.'),
      MOSS('I sat beside Hazel for a whole winter before I said a single word to her. She fidgeted. She was very bad at it.', 'soft'),
      MOSS('You aren’t to fidget.', 'happy'),
      N('He walks down into the Wellspring, slowly, the way he walks into everything. The water comes up to his chin. Then over.'),
      N('And the light comes up. Not cold. Warm. Gold, like the inside of a lantern, like a kitchen window seen from a dark road.'),
      N('It fills the cave and the ledge and the frozen falls, and the ice on the falls glows the colour of honey.'),
      N('Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet.'),
      N('When you can see again, the water is still, and lit very faintly from below, and Moss is gone.'),
    ],
    [
      {
        id: 'reader:c10-moss-walks-bearer-l1',
        domain: 'literacy',
        skill: 'understand a metaphor',
        standard: 'L.4.5',
        kind: 'ask',
        after: 2,
        prompt: [N('Moss calls the stone “a friend who has stayed out too late”. Is the stone really his friend?')],
        options: [
          {
            label: 'No. It’s a metaphor for Cinder',
            best: true,
            reply: [
              N('Yes. A metaphor says one thing is another, to show something deeper.'),
              N('The stone speaks in Cinder’s voice. Taking it home is Moss’s way of bringing his old friend home at last.'),
            ],
          },
          {
            label: 'Yes. Stones can be friends',
            reply: [
              N('In this story, anything is possible! But Moss is using a metaphor: saying one thing is another, to show something deeper.'),
              N('The stone speaks in Cinder’s voice. Taking it home is Moss’s way of bringing his old friend home at last.'),
            ],
          },
        ],
        parentNote: 'Understood a metaphor that compares the stone to a friend who needs bringing home.',
      },
      {
        id: 'reader:c10-moss-walks-bearer-l2',
        domain: 'sel',
        skill: 'manage fear by helping',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 7,
        lines: [
          N('Moss is scared too. He makes a little joke anyway: “You aren’t to fidget.” Even the oldest ones get scared.'),
          N('Your arm shakes, and you hold the lantern up anyway. Doing one small useful thing can help you through a big scary moment.'),
        ],
        parentNote: 'Learned that doing one small helpful thing can steady you when you’re scared.',
      },
    ],
  ),

  scene(
    'c10-bank-wisp',
    [
      N('You sit down on the warm rock at the edge of the water.'),
      N('When you don’t know what to do, sit down next to them and wait.'),
      N('So you wait. Moss sits down beside you and says nothing, which is how he says most things.'),
      N('The light in the water sinks, slowly, and goes out. Nothing comes up.'),
      MOSS('He wanted it so much. I always thought that was the worst thing about him.', 'soft'),
      N('Outside, the falls start to run again: a trickle, then a rush, then the old roar.'),
      N('Steam rises off the spring again. Grey light comes in at the cave mouth.'),
      N('And there, on the far side of the pool, curled in a hollow of warm stone, is Wisp.'),
      N('He is asleep. He is grey, and he will be grey always. His torn ear lies flat against his head.'),
      N('And for the first time since you have known him, he is not trembling.'),
      MOSS('…Well. I was wrong about him. I am nearly never wrong. Don’t tell Hazel.', 'happy'),
      N('You carry him home. He doesn’t bite you. He doesn’t even wake up.'),
    ],
    [
      {
        id: 'reader:c10-bank-wisp-l1',
        domain: 'literacy',
        skill: 'notice a character changing his mind',
        standard: 'RL.2.3',
        kind: 'notice',
        after: 10,
        lines: [
          N('At the start of the night, Moss thought wanting was the worst thing about Wisp. Now he says, “I was wrong about him.”'),
          N('In stories, the characters who can say “I was wrong” are often the wisest ones.'),
        ],
        parentNote: 'Noticed how a character responds to events by changing his mind.',
      },
      {
        id: 'reader:c10-bank-wisp-l2',
        domain: 'sel',
        skill: 'think about mercy',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 11,
        prompt: [
          N('In the summer, Wisp stole from Sable. He could have been driven off. Instead he was shown mercy: kindness when you could have been hard.'),
          N('Tonight his wanting saved everyone. Was sparing him the right thing, even before anyone knew how it would turn out?'),
        ],
        options: [
          {
            label: 'Yes. Everyone deserves a chance',
            reply: [
              N('That’s a generous answer. Hazel’s first rule is to feed them before you feed yourself, and she never asked who deserved it.'),
              N('Mercy never knows how things will turn out. That is what makes it mercy.'),
            ],
          },
          {
            label: 'Yes, but only because it worked out',
            reply: [
              N('That’s an honest answer. Here’s a question to keep: would it still have been right if he had never helped?'),
              N('Many people think kindness is right even when nobody ever finds out that it mattered.'),
            ],
          },
          {
            label: 'I’m not sure. He was a thief',
            reply: [
              N('That’s a fair thing to feel. Wisp did steal, and it mattered to Sable.'),
              N('Mercy isn’t pretending the wrong didn’t happen. It is choosing not to add another hurt.'),
            ],
          },
        ],
        parentNote: 'Thought about mercy: whether sparing someone who did wrong was right, with no single right answer.',
      },
    ],
  ),

  scene(
    'c10-bank-moss-returned',
    [
      N('You sit down on the warm rock at the edge of the water.'),
      N('When you don’t know what to do, sit down next to them and wait.'),
      N('So you wait. After a while Marina comes in from the cave mouth, coiling her rope, and sits beside you.'),
      MARINA('Talk about him. Out loud. It helps. That’s all that singing was, back there: people talking about him out loud.', 'soft'),
      N('So you tell her. The first morning on the hill: “…You lift and push.” I bruise like fruit. The pale one’s shoelace.'),
      N('The afternoons you sat with him and said nothing at all. There were a lot of those. You remember every one.'),
      N('Marina laughs in the right places. You talk until your voice goes. Then you just remember, which is quieter, and the same.'),
      N('Outside, the falls start to run again: a trickle, then a rush, then the old roar.'),
      N('Steam rises off the spring again. Grey light comes in at the cave mouth.'),
      N('Something breaks the surface. Small, and grey, and very, very thin.'),
      N('Moss climbs out onto the bank, slowly, the way he climbs everything, and sits, and shakes his ears.'),
      MOSS('You were very loud. All of you. I could hear you from the bottom.', 'happy'),
      N('He is thinner. The light goes through him in places it didn’t before. But he is here, and he is wet and cross.'),
      MOSS('Don’t pick me up. I mean it.', 'think'),
      MOSS('…No. Go on, then.', 'soft'),
    ],
    [
      {
        id: 'reader:c10-bank-moss-returned-l1',
        domain: 'sel',
        skill: 'talking helps with worry',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 3,
        lines: [
          MARINA('When you’re worried or sad, saying it out loud to someone who listens can make the feeling a bit smaller.', 'soft'),
          MARINA('It doesn’t fix things. It makes them easier to carry.'),
        ],
        parentNote: 'Learned that talking to a good listener can help with worry and sadness.',
      },
      {
        id: 'reader:c10-bank-moss-returned-l2',
        domain: 'social-studies',
        skill: 'how stories carry the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 6,
        lines: [
          N('This is how stories carry the past. Long before books, people kept their history by telling it out loud, again and again.'),
          N('The Lantern Song is the valley’s history, sung. Your stories about Moss are part of it now.'),
        ],
        parentNote: 'Learned about oral history: how people pass on the past by telling and singing it.',
      },
    ],
  ),

  scene(
    'c10-bank-moss-gone',
    [
      N('You sit down on the warm rock at the edge of the water.'),
      N('When you don’t know what to do, sit down next to them and wait.'),
      N('So you wait. After a while Marina comes in from the cave mouth, coiling her rope, and sits beside you.'),
      MARINA('Talk about him. Out loud. It helps. That’s all that singing was, back there: people talking about him out loud.', 'soft'),
      N('So you tell her. The first morning on the hill: “…You lift and push.” I bruise like fruit. The pale one’s shoelace.'),
      N('And then you can’t think what else. You didn’t sit with him as often as you meant to. You thought there would be time.'),
      N('Marina doesn’t say anything. She just stays, which is the same thing.'),
      N('Outside, the falls start to run again. Steam rises off the spring again. Grey light comes in at the cave mouth.'),
      N('Nothing comes up. The water is warm and smooth, and lit very faintly from below, and nothing comes up out of it.'),
      N('You wait anyway, until Marina puts her hand on your shoulder. Then a little longer.'),
      MARINA('He was the oldest thing in this valley. Older than the trees, Hazel used to say. He knew the way.', 'sad'),
      N('Moss has faded. In the Grove, that is the word for it. It means he has died. He isn’t coming back.'),
    ],
    [
      {
        id: 'reader:c10-bank-moss-gone-l1',
        domain: 'sel',
        skill: 'understand regret',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('That feeling, “I wish I had done more”, is called regret. Almost everyone feels it when someone they love dies.'),
          N('Regret doesn’t mean you didn’t love them. It means you did.'),
        ],
        parentNote: 'Named regret as a normal part of grief.',
      },
      {
        id: 'reader:c10-bank-moss-gone-l2',
        domain: 'sel',
        skill: 'what helps when someone dies',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 11,
        lines: [
          MARINA('Sad, cross, empty, all of it at once. Every one of those is what missing someone feels like. They’re all allowed.', 'soft'),
          MARINA('What helps is staying close to people, and talking about him, and remembering. He was made of being remembered. And you remember him.'),
        ],
        parentNote: 'Learned that many feelings are normal after a death, and what helps: people, talking and remembering.',
      },
    ],
  ),

  scene(
    'c10-dawn',
    [
      N('You come out from behind the falls into the first light. The water is roaring again, white and ordinary.'),
      N('Below you the whole valley is frosted silver, and in the middle of it, small and gold, the Grove.'),
      N('Three lanterns, still burning. They held them. All night long, they held them.'),
      N('The fourth is dark. Ember has her arms round it all the same.'),
      N('And as you watch, the sun comes over the ridge, and the fourth lantern, by the long grass, which has only ever flickered…'),
      N('…steadies. Brightens. Burns. Nobody lit it. For the first time in twenty-two years, it has lit itself.'),
      N('By the time you get home the frost has melted. There is dew instead, and the whole Grove smells of spring, in the middle of winter.'),
      SPARKS('I didn’t touch it! I want that on the record. I did not touch it.', 'shock'),
      PIXEL('She didn’t. I was watching her hands. I’m always watching her hands.', 'happy'),
      N('Somebody’s soup has frozen solid in its cup overnight.'),
      N('Sparks tips it out, a perfect brown puck, and skims it across the last of the pond ice.'),
      N('It goes a very long way. Everyone watches it go. Nobody can think why it’s the funniest thing they have ever seen.'),
      N('Ember is still holding the long-grass post, coat and all. She doesn’t let go for a while after she needn’t.'),
    ],
    [
      {
        id: 'reader:c10-dawn-l1',
        domain: 'science',
        skill: 'freezing and melting can be reversed',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 10,
        prompt: [N('If the soup puck sits by Clover’s warm stove for a while, what will happen to it?')],
        options: [
          {
            label: 'It melts back into soup',
            best: true,
            reply: [
              N('Yes. Freezing and melting can go back and forth: soup to ice, ice to soup. That change can be undone.'),
              N('Not like Fern’s pie. You can’t un-bake a pie!'),
            ],
          },
          {
            label: 'It stays a puck forever',
            reply: [
              N('Only if it stays below freezing. Warm it up and it melts back into soup.'),
              N('Freezing and melting can go back and forth. Not like Fern’s pie: you can’t un-bake a pie!'),
            ],
          },
          {
            label: 'It turns into a biscuit',
            reply: [
              N('That would be a very good trick. But warming only melts it back into soup.'),
              N('Freezing and melting can go back and forth. Not like Fern’s pie: you can’t un-bake a pie!'),
            ],
          },
        ],
        parentNote: 'Predicted that frozen soup melts back to liquid, a change that can be reversed.',
      },
      {
        id: 'reader:c10-dawn-l2',
        domain: 'science',
        skill: 'friction slows moving things',
        standard: '3-PS2-1',
        kind: 'do',
        after: 11,
        check: 'edu:slide:soup-puck:ice-vs-grass',
        lines: [
          PIXEL('Experiment! Skim the puck across the ice. Now skim it across the grass.', 'happy'),
          PIXEL('Ice is so smooth there’s hardly any friction, the rubbing force that slows things down. So the puck keeps going.'),
          PIXEL('Grass is rough. Lots of friction. The puck stops almost at once. Sparks is not allowed to try it again.'),
        ],
        parentNote: 'Compared how far an object slides on ice and grass, and learned that friction slows moving things.',
      },
    ],
  ),

  scene(
    'c10-moss-stays',
    [
      N('Moss walks to the foot of the hill and sits down, carefully, like something that has decided to.'),
      N('He looks at the Keepers: red-eyed, frozen, grinning, every one of them holding a lantern burnt down to the stub.'),
      MOSS('Hazel stood there. You stand there. The chin is the same. The hands are slower. That’s better, actually.', 'soft'),
      MOSS('I’ve decided. I’ll stay a while. Someone has to tell the pale one about his shoelaces.'),
      BYTE('They are TIED.'),
      MOSS('Are they.'),
      N('Byte looks down. Byte looks up. Byte goes very pale, even for Byte.'),
      BYTE('…I heard that. I heard him. That was him.', 'shock'),
      CLOVER('We sat still long enough. All night. Of course we did.', 'happy'),
      N('Byte looks at his shoelace for a long moment. Then he kneels down in the wet grass and ties it, very carefully.'),
      N('Nobody laughs. And then everybody does, the whole Grove, until Clover has to sit down.'),
    ],
    [
      {
        id: 'reader:c10-moss-stays-l1',
        domain: 'literacy',
        skill: 'find the theme',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 2,
        prompt: [N('“The hands are slower. That’s better, actually.” What has the whole story been teaching about slow hands?')],
        options: [
          {
            label: 'Patience and gentleness win trust',
            best: true,
            reply: [N('Yes. Sable, the gate, Hazel’s two months: slow, gentle love works where force doesn’t. That is a theme, the big idea under the story.')],
          },
          {
            label: 'Faster is always better',
            reply: [
              N('That was Corvin’s idea, and look where it took him.'),
              N('The story keeps showing that slow, gentle love works where force doesn’t. That is its theme, the big idea under the story.'),
            ],
          },
          {
            label: 'Hands get tired',
            reply: [
              N('After a night of holding lanterns, they certainly do! But Moss means more than that.'),
              N('The story keeps showing that slow, gentle love works where force doesn’t. That is its theme, the big idea under the story.'),
            ],
          },
        ],
        parentNote: 'Identified the story’s theme: patience and gentleness build trust.',
      },
      {
        id: 'reader:c10-moss-stays-l2',
        domain: 'sel',
        skill: 'shared laughter after a hard time',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 10,
        lines: [
          N('After a long, scary night, laughing together helps people let go of the worry they have been holding.'),
          N('It also says, without any words: we got through it, together.'),
        ],
        parentNote: 'Noticed how laughing together after a hard time can bring people closer.',
      },
    ],
  ),

  scene(
    'c10-moss-fades',
    [
      N('Moss stops at the foot of the hill. In the morning light you can hardly see him. He is mostly a place where the light bends.'),
      MOSS('That’s done, then. All four lit. I wanted to see it once more.', 'soft'),
      MOSS('I’m going up now, I think. Not because of anything. Because it’s time, and I’m tired, and the view is good.', 'soft'),
      N('Moss is fading. In the Grove, that means he is dying. He is very, very old, and his time is nearly over.'),
      N('You kneel down by him. You want to say something. You don’t know what.'),
      MOSS('Don’t be dramatic about it. That’s Hazel’s. She won’t mind me borrowing it.', 'happy'),
      MOSS('Tell the pale one his shoelace is untied.', 'soft'),
      N('You tell Byte. Byte looks down. It is. He doesn’t tie it.'),
      N('Moss goes up the hill path, slowly, the way he climbs everything. He doesn’t look back. He never did like a fuss.'),
      N('Halfway, he stops, as if someone coming down has said his name.'),
    ],
    [
      {
        id: 'reader:c10-moss-fades-l1',
        domain: 'sel',
        skill: 'find words for a goodbye',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('You don’t know what to say. What could someone say to a friend they love, when that friend is going?')],
        options: [
          {
            label: '“Thank you.”',
            reply: [N('That’s a beautiful thing to say. Thank you for the afternoons. Thank you for waiting. Moss would pretend not to hear, and hear.')],
          },
          {
            label: '“I love you.”',
            reply: [N('That’s the most important thing anyone can say. Moss is made of being remembered, and being loved is how remembering starts.')],
          },
          {
            label: 'Nothing. Just stay close',
            reply: [N('That’s a wise answer. Rule three: sit down next to them and wait. Sometimes being there says it all.')],
          },
        ],
        parentNote: 'Thought about what to say when saying goodbye to someone they love; every answer was valued.',
      },
      {
        id: 'reader:c10-moss-fades-l2',
        domain: 'literacy',
        skill: 'understand a character’s action',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [N('Byte’s shoelace is untied. Why doesn’t he tie it?')],
        options: [
          {
            label: 'He wants to keep Moss’s last joke',
            best: true,
            reply: [N('Yes. Leaving it untied is Byte’s way of keeping Moss close. It is the last thing Moss ever said to him.')],
          },
          {
            label: 'He forgot how',
            reply: [
              N('Byte can tie a shoelace. He chooses not to.'),
              N('Leaving it untied is his way of keeping Moss close. It is the last thing Moss ever said to him.'),
            ],
          },
          {
            label: 'He is too tired',
            reply: [
              N('He is very tired! But this is a choice.'),
              N('Leaving it untied is his way of keeping Moss close. It is the last thing Moss ever said to him.'),
            ],
          },
        ],
        parentNote: 'Explained the meaning behind a character’s small action.',
      },
    ],
  ),

  scene(
    'c10-moss-mourned',
    [
      N('You come in at the gate: lift and push. Everyone looks at you, and then behind you, and then at you again.'),
      N('You shake your head.'),
      N('Moss has faded. He has died, and he isn’t coming back. Nobody says anything.'),
      N('Clover sits down where she is, in the wet grass, with her lantern in her lap.'),
      N('Byte looks down at his shoelace. It’s untied. He leaves it.'),
      DUSTY('Love them anyway. Love them harder because of it. I said that. I meant it. I just didn’t mean him.', 'sad'),
      N('On the hill, by the flat stone where he always sat, there is a flower that wasn’t there yesterday.'),
      N('A memorial flower, like Briar’s and Hush’s and Fossil’s. It is how the valley remembers.'),
    ],
    [
      {
        id: 'reader:c10-moss-mourned-l1',
        domain: 'sel',
        skill: 'people grieve in different ways',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Everyone grieves differently. Clover sits down. Byte leaves his shoelace untied. Dusty says out loud what they feel.'),
          N('There is no wrong way to be sad. It helps to let other people be sad their own way, too.'),
        ],
        parentNote: 'Noticed that people show grief in different ways, and that each way is okay.',
      },
      {
        id: 'reader:c10-moss-mourned-l2',
        domain: 'social-studies',
        skill: 'how people remember those who have died',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 7,
        prompt: [N('People all over the world remember those who have died. Which of these are real ways people do it?')],
        options: [
          {
            label: 'Planting flowers or trees',
            reply: [N('Yes, that’s one. And telling stories, and lighting candles or lanterns too. All of these are real ways people remember.')],
          },
          {
            label: 'Telling stories about them',
            reply: [N('Yes, that’s one. And planting flowers, and lighting candles or lanterns too. All of these are real ways people remember.')],
          },
          {
            label: 'Lighting candles or lanterns',
            reply: [N('Yes, that’s one. And planting flowers, and telling stories too. All of these are real ways people remember.')],
          },
          {
            label: 'All of these',
            best: true,
            reply: [N('Yes. Flowers, stories, candles and lanterns: people everywhere use them to remember. The Grove does all three.')],
          },
        ],
        parentNote: 'Learned some of the ways people around the world remember those who have died.',
      },
    ],
  ),

  scene(
    'c10-moss-light',
    [
      N('Something small and pale comes drifting down on the morning air, slow as a seed.'),
      N('It settles above Sable’s head, beside her own dark one.'),
      N('Two little lights now. One dark, one pale. Sable goes cross-eyed trying to look at both.'),
      LUNA('Oh. He left you something, sweetheart.', 'soft'),
      N('Sable sits very still. Not the stone’s kind of still. The listening kind.'),
      N('Luna laughs, and wipes her eyes, and laughs again. Both at once. That’s allowed.'),
    ],
    [
      {
        id: 'reader:c10-moss-light-l1',
        domain: 'art',
        skill: 'contrast between light and dark',
        kind: 'do',
        after: 2,
        check: 'edu:tap:lights:dark-pale',
        lines: [
          N('Tap the dark light. Now tap the pale one.'),
          N('Artists call this contrast: putting dark next to light. Each one makes the other easier to see.'),
        ],
        parentNote: 'Learned the art idea of contrast by comparing a dark and a pale light.',
      },
      {
        id: 'reader:c10-moss-light-l2',
        domain: 'sel',
        skill: 'keepsakes help us remember',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          LUNA('Keeping something from someone we’ve lost, a photo, a scarf, a little light, is a way of keeping them with us.', 'soft'),
        ],
        parentNote: 'Learned that keepsakes can help us feel close to someone who has died.',
      },
    ],
  ),

  scene(
    'c10-close',
    [
      N('The sun is up. The lanterns are burning down. The Keepers stand about in the wet grass, too tired to go home, and not one of them willing to.'),
      N('And on the hill path, coming down, there is a lantern you did not light.'),
      N('It comes slowly. It stops, now and then, the way someone stops who needs to catch their breath and won’t admit it.'),
      N('Fern sees it first. She puts her hand over her mouth.'),
      N('Then Luna. Then Clover, who starts to cry before she even knows why.'),
      N('Nobody runs to meet it. Somehow everybody knows not to. You all just stand there, and let it come.'),
      N('The lantern reaches the foot of the hill.'),
      N('The person carrying it is small and wrapped in three coats, and her boots are tied with string.'),
      N('In the crook of her other arm, something is asleep: a very thin grey Nubbin, no bigger than a fist.'),
      N('She looks at the Grove. At the four posts. At all of you, holding yours.'),
      HAZEL('Well. Look at you all.', 'soft'),
      N('Then she finds you among them, and stops looking for anyone else.'),
      N('It is her. Of course it is her.'),
    ],
    [
      {
        id: 'reader:c10-close-l1',
        domain: 'literacy',
        skill: 'use clues to describe and identify a character',
        standard: 'RL.4.3',
        kind: 'ask',
        after: 8,
        prompt: [
          N('The writer is building suspense: the feeling of waiting to find out, by holding the answer back.'),
          N('Who do you think it is? Use the clues.'),
        ],
        options: [
          {
            label: 'Hazel',
            best: true,
            reply: [N('Every clue fits. Small, three coats, boots tied with string, and carrying a stray she has been feeding in the Hollow.')],
          },
          {
            label: 'Corvin',
            reply: [
              N('A good guess. But Corvin wouldn’t tie his boots with string, and he doesn’t carry strays.'),
              N('Who has been in the Hollow, feeding the lost ones? Read on.'),
            ],
          },
          {
            label: 'A stranger from the Hollow',
            reply: [
              N('Could be! But Fern and Clover start crying before they can even see a face. They know that walk.'),
              N('Who has been in the Hollow, feeding the lost ones? Read on.'),
            ],
          },
        ],
        parentNote: 'Used descriptive clues to work out who a character was, and learned what suspense means.',
      },
      {
        id: 'reader:c10-close-l2',
        domain: 'sel',
        skill: 'think about why people show up for each other',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 12,
        prompt: [
          N('Everyone came last night. Even Ember, who doesn’t like anyone, and Byte, who thought it was a hoax.'),
          N('Why do you think people show up for each other?'),
        ],
        options: [
          {
            label: 'Because they love each other',
            reply: [N('That’s a warm answer. Love isn’t only a feeling. Sometimes it’s standing in the cold all night holding a lantern.')],
          },
          {
            label: 'Because it’s the right thing to do',
            reply: [N('That’s a strong answer. Some people show up because they’ve decided it matters, even when they don’t feel like it.')],
          },
          {
            label: 'So nobody has to be alone',
            reply: [N('That’s a kind answer. A long night feels shorter with people in it. Nobody minded standing close.')],
          },
          {
            label: 'Because the Grove is a bit theirs too',
            reply: [N('That’s a wise answer. When you help keep a place, it starts to belong to you a little. Hazel might say that’s the whole point.')],
          },
        ],
        parentNote: 'Thought about why people support each other, with every reason valued.',
      },
    ],
  ),

  scene(
    'c10-bramble',
    [
      FERN('That ear. The way it folds over at the tip. That’s… oh. That’s Bramble’s ear.', 'shock'),
      HAZEL('Found her at the edge of the ring, under a root. Her mother runs the place. Terrible manners. I gather you’ve met.', 'happy'),
      FERN('Her mother was mine. Once.', 'soft'),
      N('The little one’s ear flops over at the tip, exactly like Bramble’s. Same fold, same floppy point.'),
      N('Fern puts out one finger and touches the folded ear, very lightly.'),
      N('The thin grey Nubbin sighs in its sleep, and leans into it.'),
    ],
    [
      {
        id: 'reader:c10-bramble-l1',
        domain: 'science',
        skill: 'traits passed from parents to young',
        standard: '3-LS3-1',
        kind: 'ask',
        after: 3,
        prompt: [N('Babies inherit some things from their parents: they are born with them. Which of these did the little one inherit from Bramble?')],
        options: [
          {
            label: 'The fold at the tip of her ear',
            best: true,
            reply: [N('Yes. Body shapes, like ears, and things like fur colour can be passed from parent to baby. Like mother, like daughter.')],
          },
          {
            label: 'How thin she is',
            reply: [
              N('She is thin because she went hungry and stopped eating. That happened during her life. It can’t be passed down.'),
              N('The fold in the ear can. Body shapes and fur colour are inherited. Food and care will help with the thin.'),
            ],
          },
          {
            label: 'Her terrible manners',
            reply: [
              N('Ha! Manners aren’t inherited. They are learned, by watching.'),
              N('The fold in the ear is inherited. If she has terrible manners, she learned them from her mum.'),
            ],
          },
        ],
        parentNote: 'Sorted an inherited trait (the shape of an ear) from things that happen during life (going hungry) or are learned (manners).',
      },
    ],
  ),
];

// ================================================================ glossary

const GLOSSARY: GlossaryEntry[] = [
  { word: 'partner', meaning: 'Someone you share a plan or a piece of work with.', scene: 'c9-partner' },
  { word: 'villain', meaning: 'The bad character in a story, the one who causes the trouble.', scene: 'c9-open' },
  { word: 'stampede', meaning: 'When a big crowd of animals all rush off at once, in a panic.', scene: 'c9-open' },
  { word: 'apprentice', meaning: 'Someone who learns a job by working beside a person who already knows it well.', scene: 'c9-shard-reconciled' },
  { word: 'churned', meaning: 'Stirred and mashed up roughly, like mud after lots of feet have run through it.', scene: 'c9-shard-forced' },
  { word: 'numb', meaning: 'Unable to feel anything, often because of cold.', scene: 'c9-shard-collector' },
  { word: 'flinch', meaning: 'To jump or pull back quickly because something is scary or painful.', scene: 'c9-sable' },
  { word: 'shard', meaning: 'A sharp, broken piece of something hard, like glass or ice.', scene: 'c9-close' },
  { word: 'unmake', meaning: 'To undo something so completely that it stops existing.', scene: 'c9-close' },
  { word: 'solstice', meaning: 'The day with the shortest or longest daylight of the year. The winter solstice has the longest night.', scene: 'c10-open' },
  { word: 'axis', meaning: 'An imaginary line through the middle of something that spins, like the Earth.', scene: 'c10-open' },
  { word: 'insulate', meaning: 'To wrap something so that heat can’t easily get in or out.', scene: 'c10-sable-watch' },
  { word: 'vigil', meaning: 'Staying awake through the night to keep watch, often with other people.', scene: 'c10-vigil' },
  { word: 'covet', meaning: 'To want something that isn’t yours very, very badly.', scene: 'c10-vigil-wisp' },
  { word: 'control group', meaning: 'In an experiment, the group you leave unchanged, so you can compare it with the one you changed.', scene: 'c10-lull' },
  { word: 'simile', meaning: 'A comparison that uses “like” or “as”, such as “thin as a page”.', scene: 'c10-falls' },
  { word: 'bearer', meaning: 'The one who carries something important.', scene: 'c10-bearer-sable' },
  { word: 'faint', meaning: 'Pale and hard to see. It can also mean feeling dizzy, as if you might fall.', scene: 'c10-bearer-moss' },
  { word: 'ledge', meaning: 'A narrow, flat shelf of rock along the side of a cliff.', scene: 'c10-ledge' },
  { word: 'temptation', meaning: 'Wanting very much to do something you know you shouldn’t.', scene: 'c10-edge' },
  { word: 'theme', meaning: 'The big idea a story is about, underneath what happens.', scene: 'c10-edge' },
  { word: 'grief', meaning: 'The deep sadness of missing someone who has died or gone.', scene: 'c10-safe-moss' },
  { word: 'metaphor', meaning: 'Words that say one thing is another, to show something deeper.', scene: 'c10-moss-walks' },
  { word: 'mercy', meaning: 'Choosing to be kind to someone when you could have been hard on them.', scene: 'c10-bank-wisp' },
  { word: 'regret', meaning: 'The feeling of wishing you had done something differently.', scene: 'c10-bank-moss-gone' },
  { word: 'fade', meaning: 'The Grove’s word for when an Eternal dies: they grow fainter until they are gone.', scene: 'c10-bank-moss-gone' },
  { word: 'friction', meaning: 'The rubbing force between two surfaces that slows moving things down.', scene: 'c10-dawn' },
  { word: 'memorial', meaning: 'Something that helps people remember someone who has died.', scene: 'c10-moss-mourned' },
  { word: 'contrast', meaning: 'A big difference, like dark next to light, that makes each one stand out.', scene: 'c10-moss-light' },
  { word: 'suspense', meaning: 'The excited, worried feeling of waiting to find out what happens.', scene: 'c10-close' },
  { word: 'inherit', meaning: 'To get something from your parents, like the shape of your ears or the colour of your hair.', scene: 'c10-bramble' },
];

// ================================================================ the campaign slice

export const EDU_CAMPAIGN_3A_READER: EduCampaign = {
  id: 'reader:book3a',
  band: 'reader',
  chapters: {
    9: {
      title: 'Corvin’s Garden',
      goalText: 'Go up the valley to Corvin’s garden. Then decide what to do about him, and about Ash.',
      hint: 'You choose in the scene. Think about what each choice costs. Whatever you choose, something cold comes home with you.',
    },
    10: {
      title: 'The Long Night',
      goalText: 'Light all four lanterns at dusk. Keep them burning through the longest night of the year, until the sun comes back.',
      hint: 'Tap a lantern post to light it. If the cold blows one out, light it again. How often you petted Moss before tonight matters now.',
    },
  },
  scenes: [...C9, ...C10A, ...C10B],
  glossary: GLOSSARY,
  notes:
    'Reader band, Book Three chapters 9–10 (every c9-* and c10-* scene). All choices kept with original ids, sets and ' +
    'friendship, including bargain, force and keep the stone (their cost is framed in the then lines). Death is named ' +
    'plainly in c10-bank-moss-gone, c10-moss-fades and c10-moss-mourned. Think questions: c9-open (trust after wrongdoing), ' +
    'c9-sable, c10-bank-wisp (mercy), c10-moss-fades, c10-close. Lesson order keeps maths lessons apart along every route. ' +
    'MIRROR (2026-10-14, campaign-book3.ts fixes). c9-open-sold replaces c9-open on the Collector route (soldNubbin && ' +
    '!boughtBack): same choice ids, plus the Nubbin you sold in the second row and its own think question; both share ' +
    'C9_ARRIVE, C9_GARDEN and the trust lesson. Its choices are C9_CHOICES_SOLD: bargain also buys your old Nubbin ' +
    'back on screen (Corvin: “And that one…”), because the bargain side effect brings it home. c9-shard-collector now only follows force (Corvin sees his ' +
    'own method in yours), and it and c9-shard-forced end with Ash following Ember home. c9-close answers why only the ' +
    'fourth shard, and why not long ago. c10-vigil: Luna sings the first half-line, speaker chorus answers. Canon: the ' +
    'Wellspring never freezes (steam after the unmaking, a ring of frost on the keep route); Moss sat beside Hazel for a ' +
    'winter, not the reverse; Bramble’s and her youngest’s ears fold at the tip (only Wisp’s is torn), so the c10-bramble ' +
    'inheritance lesson now contrasts the fold with going hungry; Moss’s flower is by the flat stone; Sparks and Pixel are ' +
    'she.',
};

export const CHECKS: string[] = [
  'edu:tap:rhyme:fast-last',
  'edu:slide:soup-puck:ice-vs-grass',
  'edu:tap:lights:dark-pale',
];
