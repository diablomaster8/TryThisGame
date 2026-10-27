/**
 * Payoffs for the Monty Python (Q1–Q20) fun quests: a later line keyed on an earlier choice, read only
 * inside the same pack (fun quests never read or write campaign flags). Merged into
 * CHOICE_PAYOFFS, so one scene id has one entry here and none anywhere else.
 *
 * The quests open in any order, so a payoff in a later quest plays only when its source quest
 * came first; otherwise the scene runs as written. Every band (main, sprout, reader) names its
 * own anchor, because the Learning Grove rewrites the lines.
 */
import type { BandText, Payoff } from './payoff-kit';
import { by } from './payoff-kit';

/** Q2's verdict, seen again on Sergeant Grimble's logs (Q18). */
const Q02_VERDICT: Record<string, BandText> = {
  even: {
    main: 'The one on the end is Sir Dentwhistle, bareheaded. It gives you a nod, as one equal to another. Honours even.',
    reader:
      'The one on the end is Sir Dentwhistle, with no helmet. It gives you a nod, as one equal to another. Honours even.',
    sprout: 'One is Sir Dentwhistle! It nods at you. You both did well.',
  },
  lost: {
    main: 'The one on the end is Sir Dentwhistle, bareheaded. It tells its neighbour it lost to you three times, and looks very rested.',
    reader:
      'The one on the end is Sir Dentwhistle, with no helmet. It tells its neighbour it lost to you three times. It looks very rested.',
    sprout: 'One is Sir Dentwhistle! It tells a friend: I lost three times. It smiles.',
  },
};

/** Q15's stall, stocked or left empty, as Sergeant Grimble's supplier (Q18). */
const Q15_STOCKED: Record<string, BandText> = {
  true: {
    main: 'The fruit is on loan from Dibble’s stall. One run fruit. It came on a cushion, and it goes back facing the wall.',
    reader:
      'The fruit is borrowed from Mr Dibble’s stall. One run fruit, on a cushion. It goes back facing the wall.',
    sprout: 'This fruit is from Mr Dibble’s stall. Mr Dibble wants it back!',
  },
  false: {
    main: 'I tried to get the fruit from Dibble’s stall. Just out, apparently. All of it. For years.',
    reader:
      'I tried to buy the fruit from Mr Dibble’s stall. Just out, he said. All of it. Every week.',
    sprout: 'Mr Dibble’s stall had no fruit. So I brought my own!',
  },
};

/** Q4: you asked whether the coconut's journey mattered. The note on the beach says it did. */
const q04Shrugged: Payoff = (c, s) => {
  if (c.flags['q04-shrugged'] !== true) return;
  s.insertAfter(
    {
      main: 'Beside it someone has left a fruit and a note',
      reader: 'Beside it someone has left a fruit and a note',
      sprout: 'Beside it: a fruit and a note.',
    },
    {
      main: 'You asked if it mattered. It mattered to Gullwick. Uphill, into a headwind.',
      reader:
        'You asked me if it mattered where the coconut came from. It mattered to Gullwick. Uphill, into a headwind.',
      sprout: 'You asked if it mattered. It mattered to Gullwick!',
    },
    'warden-ollery',
  );
};

/** Q9: you walked faster, and the little lantern-bearer still leads the parade. */
const q09WalkedFaster: Payoff = (c, s) => {
  if (c.flags['q09-walked-faster'] !== true) return;
  s.insertAfter(
    {
      main: 'The whole crowd falls in behind you',
      reader: 'The whole crowd falls in behind you',
      sprout: 'The whole crowd follows you',
    },
    {
      main: 'The little Nubbin who carried the gourd like a lantern marches at the front, holding up an empty paw, just in case.',
      reader:
        'The little Nubbin who carried the gourd like a lantern marches at the front. It holds up an empty paw, just in case.',
      sprout: 'The little Nubbin at the front holds up a paw, like a lantern.',
    },
  );
};

export const PYTHON_PAYOFFS: Record<string, Payoff> = {
  // Python pack (fun-flag pass 2026-10-27): fun-quest flags, read only inside the same pack.
  'q01-complete': (c, s) => {
    // Your chant from the first day joins the dusk practice; the imaginary path gets raked round.
    if (c.flags['q01-chanted'] === true)
      s.insertAfter(
        {
          main: 'At dusk you can hear them practising their new name.',
          reader: 'At dusk you can hear them practising their new name.',
          sprout: 'At dusk they practise their new name.',
        },
        {
          main: 'Between tries, they do your noise from the first day. The one on the right reads it off the page.',
          reader:
            'Between tries, they do the noise you made on the first day. The one on the right reads it off the page, very carefully.',
          sprout: 'Then they try your loud noise too. One hood reads it from a page.',
        },
      );
    if (c.flags['q01-imaginary-path'] === true)
      s.insertAfter(
        {
          main: 'They settle on a flat rock by the falls.',
          reader: 'They settle on a flat rock by the falls.',
          sprout: 'One hood gets a tiny rake.',
        },
        {
          main: 'It rakes carefully round one bare patch and leaves it bare. That is the imaginary path, it explains, and nobody is to walk on it.',
          reader:
            'It rakes carefully round one bare patch and leaves it bare. That bit is the pretend path, it explains. Nobody is to walk on it.',
          sprout: 'It rakes round one bare spot. That is the pretend path. Keep off!',
        },
      );
  },
  'q02-complete': (c, s) => {
    // The stepping stones you asked about get used at last; the gentle last round was noticed.
    if (c.flags['q02-asked-round'] === true)
      s.insertAfter(
        {
          main: 'You cross the plank in two steps.',
          reader: 'You cross the plank in two steps.',
          sprout: 'You cross the plank in two big steps.',
        },
        {
          main: 'On the way back you take the stepping stones, to cheer them up. Sir Dentwhistle pretends not to see. It sees.',
          reader:
            'On the way back you use the stepping stones, to cheer them up. Sir Dentwhistle pretends not to watch. It watches the whole time.',
          sprout:
            'Coming back, you hop across the stepping stones. Sir Dentwhistle pretends not to look.',
        },
      );
    if (c.flags['q02-gentle'] === true)
      s.insertAfter(
        {
          main: 'And tell your Nubbins this: losing is only losing',
          reader: 'And tell your Nubbins this: losing is only losing',
          sprout: 'Its ears go pink. It minds a little bit.',
        },
        {
          main: 'Also, your Nubbin went easy on me in the last round. I noticed. I am choosing not to mind that either.',
          sprout: 'Your Nubbin was gentle in the last game. Thank you. I noticed.',
        },
        'sir-dent',
      );
  },
  'q03-complete': (c, s) => {
    // Old Gorrel never forgets a guess, even floating off downstream.
    if (c.flags['q03-guessed'] !== true) return;
    s.insertAfter(
      {
        main: 'He floats away on his back, waving.',
        reader: 'He floats away on his back, waving.',
        sprout: 'He floats away, waving.',
      },
      {
        main: 'And your guess was wrong, by the way! Miles out! I never forget a guess!',
        sprout: 'And your guess was wrong! Bye!',
      },
      'old-gorrel',
      'happy',
    );
  },
  'q04-complete': q04Shrugged,
  'q04-complete-kept': q04Shrugged,
  'q04-complete-shared': q04Shrugged,
  'q05-complete': (c, s) => {
    // Your Nubbin has met the bush before, and kept the leaf.
    if (c.flags['q05-tried'] !== true) return;
    s.insertAfter(
      {
        main: 'It looks up at you, then at your Nubbin',
        reader: 'It looks up at you, then at your Nubbin',
        sprout: 'It stops at your feet and looks up at you.',
      },
      {
        main: 'Your Nubbin, who has met the bush, keeps a polite distance all the same. It still has the leaf on its head.',
        reader:
          'Your Nubbin, who has already visited the bush, keeps a polite distance anyway. It still has the leaf on its head.',
        sprout: 'Your Nubbin still has a leaf on its head. From the bush!',
      },
    );
  },
  'q08-complete': (c, s) => {
    // The minutes you read in Q8's first meeting get one new item.
    if (c.flags['q08-read-minutes'] !== true) return;
    s.insertAfter(
      { main: 'Biscuit?', reader: 'Biscuit?', sprout: 'Biscuit?' },
      {
        main: 'Frannie writes up the minutes. You read them over her shoulder: “Met. Thanked the Keeper. Biscuits.”',
        sprout: 'Frannie writes the notes: Met. Thanked the Keeper. Biscuits.',
      },
    );
  },
  'q09-complete': q09WalkedFaster,
  'q09-complete-themselves': q09WalkedFaster,
  'q09-complete-pebble': q09WalkedFaster,
  'q10-complete': (c, s) => {
    // Harrow is still savouring the walk-away from round two.
    if (c.flags['q10-walked-off'] !== true) return;
    s.insertAfter(
      {
        main: 'That, Keeper, was a proper bit of business.',
        reader: 'That, Keeper, was a proper bit of business.',
        sprout: 'That was a proper bit of business!',
      },
      {
        main: 'And that walk-away! Three steps and not one look back. I’ll be dreaming about it.',
        sprout: 'And you walked away! Three steps! So good!',
      },
      'harrow',
      'happy',
    );
  },
  'q11-complete': (c, s) => {
    // Your part in the last slice: the push, or the step back.
    if (c.flags['q11-nudged'] === true)
      s.insertAfter(
        {
          main: 'Ah. The usual outcome. Lovely.',
          reader: 'Ah. The usual result. Lovely.',
          sprout: 'Ah. That always happens. Lovely.',
        },
        {
          main: 'And thank you for the encouragement. I usually have to do that part myself.',
          sprout: 'Thank you for helping. I usually do that bit.',
        },
        'mr-crisp',
      );
    if (c.flags['q11-stepped-back'] === true)
      s.insertAfter(
        {
          main: 'Mr Crisp produces a little broom',
          reader: 'Mr Crisp sweeps the confetti',
          sprout: 'He sweeps the confetti into a neat pile.',
        },
        {
          main: 'Not a speck has landed on you, either. Mr Crisp gives you a small nod: you stepped back to exactly the right spot.',
          reader:
            'Not one speck has landed on you either. Mr Crisp gives you a small nod. You stepped back to exactly the right spot.',
          sprout: 'No confetti on you! You stepped back just right.',
        },
      );
  },
  'q12-evidence': (c, s) => {
    // Q10: Harrow taught you that nobody listens to the tag.
    if (c.flags['q10-stubborn'] !== true) return;
    s.insertAfter(
      {
        main: 'Evidence three:',
        reader: 'A price tag bobs up beside it.',
        sprout: 'Clue three: it floats in the pond.',
      },
      {
        main: 'Harrow told you a tag is a cry for help. This one has floated to the surface specially.',
        reader:
          'Harrow told you that a price tag is a cry for help. This one has floated up on purpose.',
        sprout: 'Harrow said nobody listens to tags. You listen to this one.',
      },
    );
  },
  'q12-complete': (c, s) => {
    // Q10: the shopkeepers of this valley do not take tips.
    if (c.flags['q10-tipped'] !== true) return;
    s.insertAfter(
      {
        main: 'Mr Fenwick Mull counts your Shells back',
        reader: 'He looks lighter for it, somehow.',
        sprout: 'Mr Mull counts the Shells into your hand.',
      },
      {
        main: 'You try to slip him a Shell back for his trouble. He looks at it in horror, exactly as Harrow did.',
        reader:
          'You try to give him a Shell back for his trouble. He looks at it in horror, just as Harrow did.',
        sprout: 'You offer Mr Mull a Shell back. No, thank you! Just like Harrow.',
      },
    );
  },
  'q13-complete': (c, s) => {
    // The walk you had been practising was the ordinary one.
    if (c.flags['q13-practised'] !== true) return;
    s.insertAfter(
      {
        main: 'Your grant is approved.',
        reader: 'Your grant is approved.',
        sprout: 'Approved! Walk silly, often, and everywhere!',
      },
      {
        main: 'Keep practising. But practise the silly one now. The other one was practised quite enough.',
        sprout: 'Keep practising! The silly walk this time.',
      },
      'mr-strutt',
    );
  },
  'q14-complete': (c, s) => {
    // Q12's stuffed Nubbin, and your own cushion-holding and volunteering from earlier in Q14.
    if (c.flags['q12-waited'] === true)
      s.insertAfter(
        {
          main: 'Two hours later, the Nubbin wakes.',
          reader: 'Two hours later, at half past twelve',
          sprout: 'Two hours later, the Nubbin wakes.',
        },
        {
          main: 'You are a little relieved. The last Nubbin you waited on to wake up had a seam down its back.',
          reader:
            'You are a little relieved. The last time you waited for a Nubbin to wake up, it turned out to be stuffed.',
          sprout: 'Phew! The toy Nubbin from the shop never woke up.',
        },
      );
    if (c.flags['q14-held-cushion'] === true)
      s.insertAfter(
        {
          main: 'Best nap we have ever given.',
          reader: 'Best nap we have ever given.',
          sprout: 'The best nap we ever gave.',
        },
        {
          main: 'You held the cushion very well, earlier. Gently. You may hold it again some time. Just for a minute.',
          sprout: 'You held my cushion so gently. You can hold it again!',
        },
        'brother-bolster',
        'soft',
      );
    if (c.flags['q14-volunteered'] === true)
      s.insertAfter(
        {
          main: 'Keep it. We have another.',
          reader: 'Keep it. We have another.',
          sprout: 'Keep it! We have a whole room of them.',
        },
        {
          main: 'And you offered to sit in it yourself, earlier. We have opened a file on you.',
          sprout: 'You wanted to sit in the chair too. We remember!',
        },
        'brother-pouffe',
        'think',
      );
  },
  'q15-intro': (c, s) => {
    // Q12: after the brother over the ridge, you check every shopkeeper's moustache.
    if (c.flags['q12-brother'] !== true) return;
    s.insertAfter(
      {
        main: 'Behind it stands Mr Pomeroy Dibble',
        reader: 'Behind it stands Mr Pomeroy Dibble',
        sprout: 'Mr Dibble beams, in a stripy apron',
      },
      {
        main: 'You look hard at his top lip for a false moustache. There isn’t one. He appears to be his own person.',
        reader:
          'You look hard at his top lip, checking for a false moustache. There isn’t one. He seems to be his own person.',
        sprout: 'You look for a pretend moustache. None! Mr Dibble is just Mr Dibble.',
      },
    );
  },
  'q16-complete': (c, s) => {
    // Q7's "quite small", and Q16's agreement and complaint: Pixel and Byte both remember.
    if (c.flags['q16-agreed'] === true)
      s.insertAfter(
        {
          main: 'Disagreeing is easy.',
          reader: 'Disagreeing is easy.',
          sprout: 'Saying no is easy.',
        },
        {
          main: 'Outside, the rainbow is still there. Byte refers to it as a rainbow now, firmly, in case you agree with him again.',
          reader:
            'Outside, the rainbow is still there. Byte calls it a rainbow now, very firmly, in case you agree with him again.',
          sprout: 'Byte looks out of the window. Byte says it is a rainbow now.',
        },
      );
    const see = { main: 'See?', reader: 'See?', sprout: 'See?' };
    if (c.flags['q16-complained'] === true)
      s.insertAfter(
        see,
        {
          main: 'He’ll be having words with himself all evening now, by the way. In both hats.',
          reader: 'He will be having words with himself all evening now, by the way. In both hats.',
          sprout: 'Now Byte will tell himself off all night. In both hats!',
        },
        'pixel',
      );
    if (c.flags['q07-said-small'] === true)
      s.insertAfter(
        see,
        {
          main: 'And you called my palace small. Byte agreed with you. That’s how I knew you were wrong.',
          sprout: 'And you said my castle was small. It is NOT small!',
        },
        'pixel',
      );
  },
  'q17-learned': (c, s) => {
    // Q5: Sparks's counting lesson, put to use on the dock.
    if (c.flags['q05-practised'] !== true) return;
    s.insertAfter(
      {
        main: 'Step, bow, tap. Step, bow, tap. Your fish is a sprat.',
        reader: 'Again. Feel the beat.',
        sprout: 'Your rubber fish squeaks every time.',
      },
      {
        main: 'You count under your breath: one, two, three. Not four. Sparks would never forgive you.',
        reader:
          'You have practised counting to exactly three before, with Sparks. You are ready for this.',
        sprout: 'You count: one, two, three. Just like Sparks taught you!',
      },
    );
  },
  'q17-complete': (c, s) => {
    // The fish were consulted, and so was the herring; you kept the timing all the way in.
    if (c.flags['q17-asked-fish'] === true)
      s.insertAfter(
        {
          main: 'Traditional. The one who goes in keeps the herring.',
          reader: 'Traditional. The one who goes in keeps the herring.',
          sprout: 'Whoever falls in keeps the big fish.',
        },
        {
          main: 'The herring has been consulted. It is happy to go with you.',
          reader: 'The herring was consulted as well. It squeaked yes.',
          sprout: 'We asked the big fish. It squeaked yes!',
        },
        'mr-grampus',
        'soft',
      );
    if (c.flags['q17-kept-time'] === true)
      s.insertAfter(
        {
          main: 'And you may keep the bow.',
          reader: 'And you may keep the bow.',
          sprout: 'It’s great for knocking fruit out of trees.',
        },
        {
          main: 'You kept the timing all the way in, too. Your feet were still doing it underwater.',
          sprout: 'You kept the beat, even falling in! Well done.',
        },
        'mr-pilchard',
      );
  },
  'q18-intro': (c, s) => {
    // Q2's verdict on the logs, and Q15's stall as the class's fruit supplier.
    const verdict = by(c.flags['q02-verdict'], Q02_VERDICT);
    if (verdict)
      s.insertAfter(
        {
          main: 'Three Nubbins sit on the logs.',
          reader: 'Three Nubbins sit on the logs.',
          sprout: 'Three Nubbins sit on logs.',
        },
        verdict,
      );
    const stocked = c.flags['q15-stocked'];
    if (typeof stocked === 'boolean')
      s.insertAfter(
        {
          main: 'Sergeant Grimble. Tonight’s class:',
          reader: 'Sergeant Grimble. Tonight’s class:',
          sprout: 'Sergeant Grimble. Tonight:',
        },
        Q15_STOCKED[String(stocked)]!,
        'sgt-grimble',
      );
  },
  'q18-pineapple': (c, s) => {
    // Q15: you know what is usually under a cloth.
    if (c.flags['q15-peeked'] !== true) return;
    s.insertAfter(
      {
        main: 'He lifts the cloth off a crate.',
        reader: 'He lifts the cloth off a crate.',
        sprout: 'Under a cloth sits a huge, spiky pineapple.',
      },
      {
        main: 'After Mr Dibble’s stall, you had stopped expecting anything under a cloth. This is a nice change.',
        sprout: 'Something under a cloth! Not like Mr Dibble’s empty stall.',
      },
    );
  },
  'q18-complete': (c, s) => {
    // Nobody ever knows the peel.
    if (c.flags['q18-knew-peel'] !== true) return;
    s.insertAfter(
      {
        main: 'I have been ready the entire time.',
        reader: 'I have been ready the entire time.',
        sprout: 'I’ve been ready the whole time.',
      },
      {
        main: 'And you knew the peel. Nobody knows the peel. I shall be keeping an eye on you, Keeper.',
        reader:
          'And you knew the peel. Nobody knows the peel. I shall be watching you closely, Keeper.',
        sprout: 'And you knew to peel the banana! Nobody knows that!',
      },
      'sgt-grimble',
      'think',
    );
  },
  'q19-ready': (c, s) => {
    // Q14: Sister Tuft's blanket has been here before you.
    if (c.flags['q14-keeper-napped'] !== true) return;
    s.insertAfter(
      {
        main: 'At the far end of the course, a Keeper is snoring',
        reader: 'Nobody knows who put them there.',
        sprout: 'Nobody knows who put them there.',
      },
      {
        main: 'A red woollen blanket is tucked over their knees. You know that blanket. You have woken up under it.',
        sprout: 'A red blanket is on their knees. Just like your nap!',
      },
    );
  },
  'q19-race': (c, s) => {
    // Q13: your Nubbin's lying-down walk, entered unofficially.
    if (c.flags['q13-copied-nubbin'] !== true) return;
    s.insertAfter(
      {
        main: 'At the matchboxes, Piers finally arrives',
        reader: 'At the matchboxes, Piers finally arrives',
        sprout: 'Piers jumps the matchboxes.',
      },
      {
        main: 'On the sidelines, your Nubbin does its lying-down walk in support. It overtakes Algernon.',
        reader:
          'On the side of the track, your Nubbin does its lying-down walk to cheer you on. It overtakes Algernon.',
        sprout: 'Your Nubbin does its lying-down walk. It passes Algernon!',
      },
    );
  },
  'q19-complete': (c, s) => {
    // Bunty turned round, your straight face, the pineapple's sunglasses and Bunty's smaller hat.
    if (c.flags['q19-straight-face'] === true)
      s.insertAfter(
        { main: 'Jolly well run.', reader: 'Jolly well run.', sprout: 'Jolly fast!' },
        {
          main: 'And not a flicker on your face the whole way. Are you quite well?',
          sprout: 'You did not laugh once! Are you all right?',
        },
        'piers',
      );
    if (c.flags['q19-turned-bunty'] === true)
      s.insertAfter(
        { main: 'Here. The prize.', reader: 'Here. The prize.', sprout: 'And a monocle from me.' },
        {
          main: 'And thank you for turning me round earlier. I turned back, of course. One mustn’t snub a start line.',
          reader:
            'And thank you for turning me round earlier. I turned back again, of course. It seemed rude to the start line.',
          sprout: 'Thank you for turning me round. I turned back, to be polite!',
        },
        'bunty',
      );
    if (c.flags['q18-sunglasses-off'] === true)
      s.insertAfter(
        {
          main: 'The hat is tall and glossy.',
          reader: 'The hat is tall and glossy.',
          sprout: 'It only stays in if you lift one eyebrow.',
        },
        {
          main: 'You still have the pineapple’s sunglasses in your pocket. With the monocle, you are now very well dressed about the eyes.',
          reader:
            'You still have the pineapple’s sunglasses in your pocket. With the monocle as well, your eyes are now very well dressed.',
          sprout: 'You still have the pineapple’s sunglasses. So many eye things!',
        },
      );
    if (c.flags['q19-bunty-prize'] === true)
      s.insertAfter(
        {
          main: 'The sleeping Keeper wakes',
          reader: 'The sleeping Keeper wakes',
          sprout: 'The sleeping Keeper wakes',
        },
        {
          main: 'They are wearing Bunty’s slightly smaller hat. Even asleep, they look very proud of it.',
          sprout: 'The sleeping Keeper has Bunty’s little hat on. So proud!',
        },
      );
  },
  'q20-trees': (c, s) => {
    // Q4: Gullwick, still under the palm, still nice.
    if (c.flags['q04-thanked-gullwick'] !== true) return;
    s.insertAfter(
      {
        main: 'Run, swim, fly, power, stamina, sun, moon, heart. The palm',
        reader: 'Then the palm, on the coast, looking tired.',
        sprout: 'And the palm tree by the sea.',
      },
      {
        main: 'Gullwick is asleep under it. One wing lifts an inch as you pass, which is Gullwick for “still nice”.',
        reader:
          'Gullwick is asleep under it. One wing lifts a little as you pass. That is Gullwick for “still nice”.',
        sprout: 'Gullwick sleeps under the palm. Gullwick lifts one wing. Hello!',
      },
    );
  },
  'q20-complete': (c, s) => {
    // Number three was always going to be the larch.
    if (c.flags['q20-asked-three'] !== true) return;
    s.insertAfter(
      {
        main: 'Yes. That is a larch.',
        reader: 'Yes. That is a larch.',
        sprout: 'Yes. That is a larch.',
      },
      {
        main: 'And to answer your question: yes. Number three was going to be the larch.',
        sprout: 'And yes. Number three was a larch too.',
      },
      'mr-arbour',
    );
  },
};
