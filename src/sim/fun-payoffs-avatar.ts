/**
 * Payoffs for the Avatar (Q46–Q65) fun quests: a later line keyed on an earlier choice, read only
 * inside the same pack (fun quests never read or write campaign flags). Merged into
 * CHOICE_PAYOFFS, so one scene id has one entry here and none anywhere else.
 */
import type { BandText, Payoff } from './payoff-kit';
import { by } from './payoff-kit';

/** SR-20261027-1276: the lead player's greeting after Q55's finale. */
const Q55_REACTION: Record<string, BandText> = {
  boo: {
    main: 'You! The booer! Take the sad mask. You’ve earned it.',
    sprout: 'You booed! Have the sad mask.',
  },
  cheer: {
    main: 'Our fan! Take both masks. Take three. We only have two.',
    sprout: 'Our fan! Have both masks!',
  },
  storm: {
    main: 'Our new ending! Next week the Keeper doesn’t slip. Well. Slips less.',
    sprout: 'Next week, the Keeper does not slip!',
  },
};

/** Q48 step 1: who went first down the canyon; the climb out remembers. */
const Q48_FIRST: Record<string, BandText> = {
  hollins: {
    main: 'This time the Hollins wave the Drays up first. Nobody mentions it, very loudly.',
    sprout: 'This time the Hollins let the Drays go first.',
    reader: 'This time the Hollins let the Drays climb first. Nobody mentions it, very loudly.',
  },
  drays: {
    main: 'This time the Drays wave the Hollins up first. Elder Maud does not say “of course”. She says thank you.',
    sprout: 'This time the Drays let the Hollins go first.',
    reader: 'This time the Drays let the Hollins climb first. Elder Maud says thank you.',
  },
  together: {
    main: 'They climb side by side again. This time the path is wide, and they do it anyway.',
    sprout: 'They walk side by side again. This time they want to!',
    reader: 'They climb side by side again. This time the path is wide, and they do it anyway.',
  },
};

/** Q48's campfire habit, caught again at Q61's trial. */
const Q48_STORY: Record<string, BandText> = {
  detail: {
    main: 'You nearly add that Kesh sang terribly. Pemba catches your eye and shakes his head: not this time.',
    sprout: 'You almost say Kesh sang badly. Pemba shakes his head. No!',
    reader:
      'You nearly add that Kesh sang terribly. Pemba catches your eye and shakes his head. Not this time.',
  },
  nod: {
    main: 'You nod slowly and solemnly, out of habit. The mayor takes it as a confession.',
    sprout: 'You nod slowly, like at the campfire. Uh-oh.',
    reader:
      'You nod slowly and solemnly, out of habit. The mayor thinks you are agreeing with him.',
  },
  cough: {
    main: 'You cough. Pemba coughs louder, out of habit. The mayor writes down “coughing” as evidence.',
    sprout: 'You cough. Pemba coughs louder, like at the campfire.',
    reader:
      'You cough. Pemba coughs louder, just like at the campfire. The mayor writes down “coughing”.',
  },
};

/** Q50's first tea, remembered at Q65's board. */
const Q50_FIRST: Record<string, BandText> = {
  jasmine: {
    main: 'You started with jasmine at my stall, so I have made a pot. A forgiving tea for a first game.',
    sprout: 'I made jasmine tea. You like jasmine!',
    reader:
      'You started with jasmine at my stall, so I have made a pot. A forgiving tea for a first game.',
  },
  ginger: {
    main: 'I have hidden the ginger today, Keeper. Your Nubbin’s nose has been through enough.',
    sprout: 'No ginger today. Your Nubbin sneezed at it!',
    reader: 'I have hidden the ginger today, Keeper. Your Nubbin sneezed at it last time.',
  },
};

/** Q50: what Mr Pell was served; he is a regular by Q65. */
const Q50_PELL: Record<string, BandText> = {
  jasmine: {
    main: 'Mr Pell came by this morning. He asked for “the flowery one”, then said he hadn’t.',
    sprout: 'Mr Pell came today. He asked for the flower tea!',
    reader: 'Mr Pell came by this morning. He asked for “the flowery one”, then said he never did.',
  },
  black: {
    main: 'Mr Pell came by this morning. He calls black tea “the one with a spine” now. He says it to the cup.',
    sprout: 'Mr Pell came today. He wants strong black tea!',
    reader: 'Mr Pell came by this morning. He calls black tea “the one with a spine” now.',
  },
  barley: {
    main: 'Mr Pell came by this morning for his barley tea. He says it is not as good as his mother’s. He had two.',
    sprout: 'Mr Pell came for barley tea. He had two cups!',
    reader:
      'Mr Pell came by this morning for barley tea. He says it is not as good as his mother’s. He had two cups.',
  },
};

/** Q50: how Mr Pell settled up; at Q65 he turns out to be one of Tenzo's old friends. */
const Q50_PAY: Record<string, BandText> = {
  free: {
    main: 'Mr Pell, for one. He drinks on the house and pays tomorrow. It is always tomorrow. We are great friends.',
    sprout: 'Mr Pell is one. He pays me tomorrow. Always tomorrow!',
    reader:
      'Mr Pell is one of us. He drinks on the house and pays tomorrow. It is always tomorrow.',
  },
  later: {
    main: 'Mr Pell, for one. He paid his two coins the very next morning, and glared at me to make it count.',
    sprout: 'Mr Pell is one. He always pays, right on time!',
    reader: 'Mr Pell is one of us. He paid his two coins the very next morning, right on time.',
  },
  trade: {
    main: 'Mr Pell, for one. He fixes one thing at my stall every week. Nothing there has wobbled since.',
    sprout: 'Mr Pell is one. He fixes things at my stall!',
    reader:
      'Mr Pell is one of us. He fixes one thing at my stall every week. Nothing wobbles any more.',
  },
};

/** Q57's night plan, still on show at the works the next morning. */
const Q57_PLAN: Record<string, BandText> = {
  clean: {
    main: 'Under it, in smaller letters: WHO CLEANED THE RIVER? WE ARE VERY CONFUSED.',
    sprout: 'Under it, it says: WHO CLEANED THE RIVER?',
    reader: 'Under it, in smaller letters: WHO CLEANED THE RIVER? WE ARE VERY CONFUSED.',
  },
  pipe: {
    main: 'Tuk’s very large cork is still in the pipe. Somebody has stuck a little flag in it.',
    sprout: 'Tuk’s big cork is still in the pipe!',
    reader: 'Tuk’s very large cork is still in the pipe. Somebody has stuck a little flag in it.',
  },
  note: {
    main: 'Pinned beneath it is a reply to your note: “Dear River. Sorry. Love, the works.”',
    sprout: 'There is a note too. It says: Sorry, River!',
    reader: 'Pinned under it is a reply to your note: “Dear River. Sorry. Love, the works.”',
  },
};

/** Q57's painted lady, told or kept, weighed against Kettleby's statue in Q61. */
const Q57_LEGEND: Record<string, BandText> = {
  told: {
    main: 'Good. A legend is nicer when everyone knows who’s under the hat. Ma Reedy taught me that.',
    sprout: 'Good. Ma Reedy knew who the river lady was. That was nice.',
    reader:
      'Good. A legend is nicer when everybody knows who is under the hat. Ma Reedy taught me that.',
  },
  kept: {
    main: 'Records are good. Though some legends are better with no name on them. Just a hat.',
    sprout: 'Some stories are nicer as a secret. Just a hat on a boat.',
    reader: 'Records are good. But some legends are better with no name on them. Just a hat.',
  },
};

/** Q58: what the Keeper made of Aunt Wen's bones. */
const Q58_BELIEF: Record<string, BandText> = {
  believe: {
    main: 'And the Keeper believed me from the start. The bones remember who was nice to them.',
    sprout: 'And the Keeper believed me. Thank you!',
    reader: 'And the Keeper believed me from the very start. The bones remember that.',
  },
  doubt: {
    main: 'And the Keeper took your side. You two can share a shovel.',
    sprout: 'And the Keeper agreed with Tuk. Share a shovel!',
    reader: 'And the Keeper took your side. You two can share a shovel.',
  },
  wait: {
    main: 'And the Keeper said wait and see. Well, now you’ve seen. Lava, mostly.',
    sprout: 'And the Keeper waited to see. Now you know!',
    reader: 'And the Keeper said, wait and see. Well, now you have seen.',
  },
};

/** Q58: the cloud shape decides who walks up to the crater, and why. */
const Q58_CLOUD: Record<string, BandText> = {
  warning: {
    main: 'Nalu walks at the back, counting heads. Promise kept, and every diagram has a little frowning volcano in the corner.',
    sprout: 'Next day, Tuk takes everyone up to see the crater. Promise kept!',
    reader:
      'Next morning, Tuk walks the whole village up to see the crater, as he promised. Every diagram has a frowning volcano on it.',
  },
  arrow: {
    main: 'Most of them climbed up last night already, following the arrow. They come again anyway, for the diagrams.',
    sprout: 'Next day, everyone climbs up to look. They follow the arrow!',
    reader:
      'Next morning, the whole village follows the arrow up to the crater. Tuk brings diagrams anyway.',
  },
};

/** Q60: Lumi carried home or choosing to follow; a penguin chooses too in Q62. */
const Q60_HOME: Record<string, BandText> = {
  chose: {
    main: 'Things keep choosing the Keeper. First Lumi, now a penguin. I’m starting to feel left out.',
    sprout: 'First Lumi picked you. Now a penguin!',
    reader: 'Things keep choosing the Keeper. First Lumi, and now a penguin.',
  },
  carried: {
    main: 'Lumi had to be carried home. This one walked over by itself. Penguins have standards.',
    sprout: 'Lumi got carried. The penguin walked over by itself!',
    reader: 'Lumi had to be carried home. This penguin walked over all by itself.',
  },
};

/** Q61's best evidence ends up on the new statue. */
const Q61_EVIDENCE: Record<string, BandText> = {
  stone: {
    main: 'They set it on the old founding stone, with the thank-you facing out this time.',
    sprout: 'It stands on the old stone. The stone says thank you.',
    reader: 'They set it on the old founding stone, with the thank-you words facing out this time.',
  },
  map: {
    main: 'The old map goes up in the records hall, framed, with Kettleby circled on Kesh’s side.',
    sprout: 'The old map goes up on the wall, in a frame.',
    reader:
      'The old map goes up in the records hall, framed, with Kettleby circled on Kesh’s side.',
  },
  kind: {
    main: 'Its plaque reads: HE WAS NICE TO EVERYONE ALL DAY. It is still not evidence. It is still true.',
    sprout: 'Its sign says: HE WAS NICE ALL DAY.',
    reader:
      'Its sign reads: HE WAS NICE TO EVERYONE ALL DAY. It is still not evidence, but it is still true.',
  },
};

/** Q64: the rehearsal advice Kaito took to heart, brought up at Q65's board. */
const Q64_ADVICE: Record<string, [BandText, string]> = {
  honest: [
    {
      main: 'The Keeper would tell me if I was bad. The Keeper said my speech was stiff.',
      sprout: 'The Keeper tells the truth. My speech was stiff.',
      reader: 'The Keeper would tell me. The Keeper said my speech was stiff, and it was.',
    },
    'kaito',
  ],
  kind: [
    {
      main: 'The Keeper says nice things. The Keeper said my speech was a good start. It wasn’t.',
      sprout: 'The Keeper is kind. The Keeper liked my speech.',
      reader: 'The Keeper is kind. The Keeper said my speech was a good start. It wasn’t, really.',
    },
    'kaito',
  ],
  smile: [
    {
      main: 'Kaito tries the smile you suggested. Uncle Tenzo pats his hand, worried.',
      sprout: 'Kaito tries a big smile. Uncle Tenzo looks worried.',
      reader: 'Kaito tries the smile you taught him. Uncle Tenzo pats his hand, looking worried.',
    },
    'narrator',
  ],
};

/** Q64: how the Keeper helped Kaito ask; Pemba uses it to get him dancing in Q49. */
const Q64_HELP: Record<string, BandText> = {
  vouch: {
    main: 'You couldn’t do speeches either, and then you practised. The Keeper told everyone.',
    sprout: 'You practised your speech. You can practise dancing!',
    reader: 'You couldn’t do speeches either, and then you practised. The Keeper told us all.',
  },
  nudge: {
    main: 'You said that about speeches. Then the Keeper nudged you, and you did a really good one.',
    sprout: 'The Keeper helped you try again. Try again now!',
    reader:
      'You said that about speeches. Then the Keeper nudged you, and you did a really good one.',
  },
  wave: {
    main: 'You can wave. Dancing is just waving with the rest of you.',
    sprout: 'You can wave! Dancing is waving with your whole body!',
    reader: 'You can wave. Dancing is just waving with the rest of your body.',
  },
};

export const AVATAR_PAYOFFS: Record<string, Payoff> = {
  // Avatar pack (review 2026-10-27-2): fun-quest flags, read only inside the same pack.
  'q46-complete': (c, s) => {
    // SR-20261027-1275: the warning-bell cart finally gets to ring.
    if (c.flags['q46-cart'] !== 'bell') return;
    s.insertAfter(
      {
        main: 'He bounces off. The cart doesn’t move.',
        reader: 'He bounces off. The cart doesn’t move.',
        sprout: 'Boing! He bounces off.',
      },
      {
        main: 'The bell goes TING. The merchant puts a hand on his heart: thirty-one carts, and not one of them ever said TING.',
        reader: 'The bell goes TING. Thirty-one carts, and not one of them ever said TING before.',
        sprout: 'The bell goes TING! The merchant is very happy.',
      },
    );
  },
  'q47-complete': (c, s) => {
    // SR-20261027-1273: Pemba does tell everyone. Last line in first.
    if (c.flags['q47-tuk-pemba'] !== true) return;
    const anchor = {
      main: 'Strategically.',
      reader: 'Strategically.',
      sprout: 'I hummed to be brave.',
    };
    s.insertAfter(
      anchor,
      { main: 'Both hands. Strategically.', sprout: 'That was a plan.' },
      'tuk',
    );
    s.insertAfter(
      anchor,
      {
        main: 'And you held my hand! Everybody! Tuk held my hand!',
        sprout: 'And you held my hand! Everybody!',
      },
      'pemba',
      'happy',
    );
  },
  'q48-complete': (c, s) => {
    // Fun-flags pass: the climb out remembers who went first down the canyon.
    const first = by(c.flags['q48-first'], Q48_FIRST);
    if (first)
      s.insertAfter(
        {
          main: 'In the morning the two clans',
          reader: 'In the morning the two clans',
          sprout: 'In the morning, both groups',
        },
        first,
      );
    // SR-20261027-1272: the promise to tell the clans, or Nalu catching up with them.
    const truth = c.flags['q48-truth'];
    if (truth !== 'kept' && truth !== 'told') return;
    const anchor = {
      main: 'What? They’re sharing socks now.',
      reader: 'What? They’re sharing socks now.',
      sprout: 'Look! They’re sharing socks now!',
    };
    if (truth === 'told') {
      // The clans already know, so Nalu's "Pemba!" becomes her catching up. The sprout
      // scene has no Nalu line; its narrator says it instead.
      s.swapText(
        { main: 'Pemba!', reader: 'Pemba!', sprout: 'They talk and laugh.' },
        {
          main: 'They knew all along, and they kept it anyway. I need to sit down.',
          sprout: 'They talk and laugh. They knew it was pretend all along!',
        },
      );
      return;
    }
    s.insertAfter(
      anchor,
      { main: 'After the bridge. Maybe after the pudding.', sprout: 'After the pudding.' },
      'pemba',
    );
    s.insertAfter(
      anchor,
      { main: 'Pemba! You promised to tell them.', sprout: 'You promised, Pemba!' },
      'nalu',
    );
  },
  'q55-complete': (c, s) => {
    // SR-20261027-1276: the Players greet you by how you took their finale.
    const t = by(c.flags['q55-reaction'], Q55_REACTION);
    if (!t) return;
    s.insertAfter(
      {
        main: 'Take a mask or two!',
        reader: 'Take a mask or two!',
        sprout: 'Take a mask! We do the show again',
      },
      t,
      'ember-bay-players',
    );
  },

  // Fun-flags pass (2026-10-27): the rest of the pack's unread choices. Targets play after
  // their source by `requires` (Q56 → Q55/Q64; Q64 → Q49/Q55/Q65) or by quest order.
  'q49-party': (c, s) => {
    // Q64's help: Pemba talks Kaito into dancing the way the Keeper got him through his speech.
    const t = by(c.flags['q64-help'], Q64_HELP);
    if (t)
      s.insertAfter(
        {
          main: 'Mine too. Pemba, I don’t dance.',
          reader: 'Mine too. Pemba, I don’t dance.',
          sprout: 'I don’t dance.',
        },
        t,
        'pemba',
      );
  },
  'q55-act1': (c, s) => {
    // Q47's doo-be-doo comes back in the Players' tunnel scene.
    if (c.flags['q47-sang'] === true)
      s.insertAfter('Is that what I’m like?', {
        main: 'Then the actor playing Pemba sings the tunnel song, all wrong. You join in on the doo-be-doo before you can stop yourself.',
        sprout: 'The actor sings the tunnel song. You sing doo-be-doo too!',
        reader:
          'Then the actor sings the tunnel song, all wrong. You join in on the doo-be-doo before you can stop yourself.',
      });
    // Q53: you laughed when Sumi flattened him, and Tuk keeps a list.
    if (c.flags['q53-laughed'] === true)
      s.insertAfter(
        { main: 'I have depth!', reader: 'I have depth!', sprout: 'I am more than meat!' },
        {
          main: 'And YOU laughed. You laughed in the dojo yard too. I’m keeping a list.',
          sprout: 'And you laughed! You laughed at the dojo too!',
          reader:
            'And YOU laughed. You laughed at me in the dojo yard as well. I’m keeping a list.',
        },
        'tuk',
        'angry',
      );
  },
  'q55-act1-done': (c, s) => {
    // Q56: the Keeper packed snacks for Rumble Night, and still has peanuts.
    if (c.flags['q56-snacks'] !== true) return;
    s.insertAfter(
      {
        main: 'Look at that. Growth.',
        reader: 'Look at that. Growth.',
        sprout: 'Look at that. You’ve grown.',
      },
      {
        main: 'You pass the peanuts. Ever since Rumble Night, you are officially the one who brings snacks.',
        sprout: 'You pass the peanuts. You always bring snacks now!',
        reader:
          'You pass the peanuts. Ever since Rumble Night, you have been the one who brings the snacks.',
      },
    );
  },
  'q56-bout': (c, s) => {
    // Q53: a Nubbin that sparred with Sumi moves like it. Bao feels it through the floor.
    if (c.flags['q53-nubbin-spar'] !== true) return;
    s.insertAfter(
      {
        main: 'Huh. Small, heavy',
        reader: 'She says, “Huh. Small',
        sprout: 'She says, “Small and heavy',
      },
      {
        main: 'She tilts her head. “Light on its feet, too. Somebody’s been sparring with this one.”',
        sprout: 'She says, “Light feet, too. It knows how to spar!”',
        reader:
          'She tilts her head. “Light on its feet, too. Somebody has been sparring with this one.”',
      },
    );
  },
  'q57-complete': (c, s) => {
    // The night's plan is still on show at the works.
    const plan = by(c.flags['q57-plan'], Q57_PLAN);
    if (plan)
      s.insertAfter(
        {
          main: 'The village wakes to clear water',
          reader: 'The works upstream has hung',
          sprout: 'The works puts up a sign',
        },
        plan,
      );
    // The Grove fruit from step 1 took root.
    if (c.flags['q57-gave-fruit'] === true)
      s.insertAfter(
        {
          main: 'And these little fish.',
          reader: 'And these little fish.',
          sprout: 'Put them in your stream.',
        },
        {
          main: 'And thank you for the fruit. One of the children planted a stone from it, and waters it twice a day.',
          sprout: 'Thank you for the fruit! A child planted a seed.',
          reader:
            'And thank you for the fruit. One of the children planted a stone from it. She waters it twice a day.',
        },
        'ma-reedy',
        'happy',
      );
  },
  'q58-reading': (c, s) => {
    // Q51: Aunt Wen "sees" the cactus juice the Keeper put down.
    if (c.flags['q51-sip'] !== true) return;
    s.insertAfter(
      {
        main: 'And you, young man',
        reader: 'And you, young man',
        sprout: 'Nubbins always find snacks.',
      },
      {
        main: 'And the Keeper once smelled a cup of cactus juice and put it down again. The bones approve.',
        sprout: 'And you! You did not drink the cactus juice. Good!',
        reader:
          'And the Keeper once smelled a cup of cactus juice and put it down again. The bones like that.',
      },
      'aunt-wen',
    );
  },
  'q58-clouds': (c, s) => {
    // Q52: Puffin's bedtime whistle keeps him on course.
    if (c.flags['q52-whistle'] !== true) return;
    s.insertAfter(
      {
        main: 'High above, Pemba and Puffin',
        reader: 'High above, Pemba and Puffin',
        sprout: 'Up high, Pemba and Puffin',
      },
      {
        main: 'When Puffin drifts off course, you whistle his bedtime tune. He swings back at once, yawning.',
        sprout: 'Puffin drifts away. You whistle his tune. He comes back!',
        reader:
          'When Puffin drifts off course, you whistle his bedtime tune. He swings back at once, yawning.',
      },
    );
  },
  'q58-complete': (c, s) => {
    const belief = by(c.flags['q58-belief'], Q58_BELIEF);
    if (belief) s.insertAfter('I believe one word.', belief, 'aunt-wen', 'happy');
    const cloud = by(c.flags['q58-cloud'], Q58_CLOUD);
    if (cloud)
      s.insertAfter(
        {
          main: 'Next morning Tuk',
          reader: 'I’m right more often',
          sprout: 'Bring your Nubbins to me.',
        },
        cloud,
      );
  },
  'q59-complete': (c, s) => {
    // The bison whistle Pemba blew on the river reaches Puffin in the end.
    if (c.flags['q59-whistle'] !== true) return;
    s.insertAfter(
      {
        main: 'Your Nubbin can do it too!',
        reader: 'Your Nubbin can do it too!',
        sprout: 'Your Swim Nubbin flicks its tail.',
      },
      {
        main: 'Around midnight, Puffin lands by the fire, looking for whoever whistled. Pemba hides the bison whistle behind his back.',
        sprout: 'Then Puffin lands by the fire. Who whistled? Pemba hides the whistle.',
        reader:
          'Around midnight, Puffin lands by the fire, looking for whoever whistled. Pemba hides the bison whistle behind his back.',
      },
    );
  },
  'q61-trial': (c, s) => {
    // Q48: the campfire habit with Pemba's made-up ancestors.
    const t = by(c.flags['q48-story'], Q48_STORY);
    if (t)
      s.insertAfter(
        {
          main: 'Hey! That’s Avatar Kesh!',
          reader: 'Hey! That’s Avatar Kesh!',
          sprout: 'That’s Avatar Kesh!',
        },
        t,
      );
  },
  'q61-complete': (c, s) => {
    const evidence = by(c.flags['q61-evidence'], Q61_EVIDENCE);
    if (evidence)
      s.insertAfter(
        {
          main: 'That evening the straw statue',
          reader: 'That evening the straw statue',
          sprout: 'The people make a new one.',
        },
        evidence,
      );
    if (c.flags['q61-sweet'] === true)
      s.insertAfter(
        {
          main: 'From now on, Avatar Day',
          reader: 'From now on, Avatar Day',
          sprout: 'From now on, it’s Pemba Day!',
        },
        {
          main: 'The new festival sweets are shaped like Pemba. They taste of peppermint, and no guilt at all.',
          sprout: 'The new sweets look like Pemba. Peppermint! Yum!',
          reader:
            'The new festival sweets are shaped like Pemba. They taste of peppermint, and no guilt at all.',
        },
      );
    // Q57: Nalu has her own view on legends with somebody under the hat.
    const legend = by(c.flags['q57-legend'], Q57_LEGEND);
    if (legend)
      s.insertAfter(
        {
          main: 'And from now on, we read',
          reader: 'And from now on, we read',
          sprout: 'And next time, we’ll read',
        },
        legend,
        'nalu',
        'soft',
      );
  },
  'q62-sled': (c, s) => {
    // Q60: Lumi chose the Keeper (or was carried); now the penguin chooses too.
    const t = by(c.flags['q60-home'], Q60_HOME);
    if (t)
      s.insertAfter(
        {
          main: 'That penguin has better judgement',
          reader: 'That penguin has better judgement',
          sprout: 'Smart penguin.',
        },
        t,
        'pemba',
      );
  },
  'q62-complete': (c, s) => {
    // The Nubbins who huddled round the ice get their thanks.
    if (c.flags['q62-huddle'] !== true) return;
    s.insertAfter(
      {
        main: 'Thanks for getting me out.',
        reader: 'Thanks for defrosting me',
        sprout: 'Thank you for the rescue.',
      },
      {
        main: 'And thank the Nubbins. I woke up warm on one side. The Nubbin side.',
        sprout: 'Thank you, Nubbins! You kept me warm.',
        reader: 'And thank you, Nubbins. I woke up warm on one side. The Nubbin side.',
      },
      'pemba',
      'happy',
    );
  },
  'q63-pet': (c, s) => {
    // Q60: the bait that found Lumi.
    if (c.flags['q60-bait'] === true)
      s.insertAfter(
        'I love roofs!',
        {
          main: 'Or we leave a peach out and wait. That’s how we found Lumi. The Keeper’s idea!',
          sprout: 'Or leave out a fruit! That is how we found Lumi.',
          reader:
            'Or we leave a peach out and wait! That’s how we found Lumi. It was the Keeper’s idea.',
        },
        'pemba',
        'happy',
      );
    // Q52: the Nubbin that led the way to Puffin, wrong way first.
    if (c.flags['q52-nubbin-leads'] === true)
      s.insertAfter(
        {
          main: 'Your Nubbin is already climbing',
          reader: 'Your Nubbin is already climbing',
          sprout: 'Your Nubbin climbs the highest wall',
        },
        {
          main: 'Last time that Nubbin led, it marched off the wrong way first. Then it turned round and was right. Give it a minute.',
          sprout: 'Last time, it went the wrong way first. Then the right way!',
          reader:
            'Last time that Nubbin led the way, it went the wrong way first. Then it turned round and was right.',
        },
        'tuk',
      );
  },
  'q63-pet-done': (c, s) => {
    // Q46: the Keeper bought his dented cabbages, and he hasn't forgotten.
    if (c.flags['q46-bought-dented'] !== true) return;
    s.insertAfter(
      {
        main: 'My cabbages! Not UP there!',
        reader: 'Not the cabbages! Not up there!',
        sprout: 'Not the cabbages! Not up there!',
      },
      {
        main: 'Still. Dented cabbages are still cabbages. Keeper, the bruised ones are yours at half price!',
        sprout: 'Dented cabbages are still cabbages! Keeper, want some?',
        reader:
          'Still. Dented cabbages are still cabbages! Keeper, you can have the dented ones again.',
      },
      'cabbage-merchant',
    );
  },
  'q63-complete': (c, s) => {
    // The Keeper laughed along on day one, and the Nubbin brayed.
    if (c.flags['q63-laughed'] !== true) return;
    s.insertAfter(
      {
        main: 'I know! Now take a bit',
        reader: 'I know! Now take a bit',
        sprout: 'I know! Take a bit',
      },
      {
        main: 'Though your Nubbin has the laugh already. It brayed at me on day one. A natural!',
        sprout: 'Your Nubbin has my laugh already. Hee-haw!',
        reader:
          'Your Nubbin has my laugh already. It brayed at me on the very first day. A natural!',
      },
      'rumbold',
      'happy',
    );
  },
  'q64-ask-done': (c, s) => {
    // Q61: Tuk's career at the Kettleby bar.
    if (c.flags['q61-tuk-lawyer'] === true)
      s.insertAfter(
        {
          main: 'No. Not just like that.',
          reader: 'No. Not just like that.',
          sprout: 'Not just like that.',
        },
        {
          main: 'I’ve been a lawyer, you know. In Kettleby. I’ve read a book.',
          sprout: 'I was a lawyer once. I read a book!',
          reader: 'Trust me, I was a lawyer once. In Kettleby. I’ve read a book.',
        },
        'tuk',
      );
    // Q59: being told off on the river is why Nalu gives the chance.
    if (c.flags['q59-told-off'] === true)
      s.insertAfter(
        {
          main: 'Good. You shouldn’t.',
          reader: 'Good. You shouldn’t.',
          sprout: 'That’s fair. I want',
        },
        {
          main: 'The Keeper told me off once, on a river, for taking something. I hated it. It helped.',
          sprout: 'The Keeper told me off once. It helped me.',
          reader: 'The Keeper told me off once, on a river. I hated it. But it helped.',
        },
        'nalu',
        'soft',
      );
  },
  'q65-tiles': (c, s) => {
    // Q50: Tenzo remembers which tea the Keeper started with.
    const t = by(c.flags['q50-first'], Q50_FIRST);
    if (t)
      s.insertAfter(
        {
          main: 'Your Nubbin picks up a flower tile',
          reader: 'Your Nubbin picks up a flower tile',
          sprout: 'Your Nubbin sniffs a flower tile',
        },
        t,
        'tenzo',
        'happy',
      );
  },
  'q65-tiles-done': (c, s) => {
    // Q64: Kaito quotes the rehearsal advice back.
    const t = by(c.flags['q64-advice'], Q64_ADVICE);
    if (t) s.insertAfter('I have never said it to you', t[0], t[1]);
  },
  'q65-game': (c, s) => {
    // Q50: Mr Pell is a regular now.
    const t = by(c.flags['q50-pell'], Q50_PELL);
    if (t)
      s.insertAfter(
        {
          main: 'The rain grows heavier.',
          reader: 'The rain grows heavier.',
          sprout: 'The rain falls harder.',
        },
        t,
        'tenzo',
      );
  },
  'q65-complete': (c, s) => {
    // Q50: Mr Pell turns out to be one of the old friends with slow games.
    const pay = by(c.flags['q50-pay'], Q50_PAY);
    if (pay)
      s.insertAfter(
        {
          main: 'There are more of us',
          reader: 'There are more of us',
          sprout: 'Old friends who play slow games',
        },
        pay,
        'tenzo',
      );
    // Q65 step 2: the Nubbin got the credit for the clever move.
    if (c.flags['q65-credit'] === 'nubbin')
      s.insertAfter(
        {
          main: 'I am in a tea society.',
          reader: 'I am in a tea society.',
          sprout: 'A tea club. Mostly.',
        },
        {
          main: 'On the way out, Uncle Tenzo bows to your Nubbin, one strategist to another. Your Nubbin bows back.',
          sprout: 'Uncle Tenzo bows to your clever Nubbin. It bows back!',
          reader:
            'On the way out, Uncle Tenzo bows to your Nubbin, one strategist to another. Your Nubbin bows back.',
        },
      );
  },
};
