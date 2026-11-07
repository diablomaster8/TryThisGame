// Request voices, part 1: pet, feed, fruit, race, karate and lanterns (was strings-requests.ts).
import type { RequestVoice } from './strings-requests-types';

export const REQUEST_VOICE_CORE: Record<string, RequestVoice> = {
  pet: {
    fallback: { ask: 'Your Nubbins would love a few pats.', thanks: 'That was kind. Thank you.' },
    nubbin: {
      ask: '{name} drifts over and leans against your leg, hoping for a pat.',
      thanks: '{name} wriggles happily. That was the right spot.',
    },
    by: {
      fern: {
        ask: 'Someone here wants a pat. Several someones. Do the rounds.',
        thanks: 'Lovely. The hens are jealous, but they’ll cope.',
      },
      marina: {
        ask: 'Pat a few Nubbins. Rule eight: a Nubbin patted is a Nubbin dried.',
        thanks: 'Rule eight, kept. Salt and sand included.',
      },
      sparks: {
        ask: 'Pet the Nubbins! Quick pats, I mean. Fast ones. Not too fast.',
        thanks: 'Good. They’re wriggling. I’m wriggling too.',
      },
      clover: {
        ask: 'Give the Nubbins a good pat, dear. They deserve it, and so do you.',
        thanks: 'Good. Now they’ll sleep like stones in a warm bed.',
      },
      pixel: {
        ask: 'Pet some Nubbins. Gently. No buttons involved, I promise.',
        thanks: 'Their happy count went up. Mine did too. Beep.',
      },
      luna: {
        ask: 'A few pats, please. Slowly. Slow is the whole trick.',
        thanks: 'Mm. That was nice. I may sit down now. Again.',
      },
      ember: {
        ask: 'Give them a pat for me. Chin down, soft hands, no jabs.',
        thanks: 'Good form. Not one jab. I’m proud of you.',
      },
      byte: {
        ask: 'Pet the Nubbins. I’ll note the mood afterwards. It will be up.',
        thanks: 'Logged. Mood up by a measurable amount. Thank you.',
      },
      dusty: {
        ask: 'Could you pat a few Nubbins? They’re softer than any fossil.',
        thanks: 'Soft, warm and not at all dusty. A fine find.',
      },
      nova: {
        ask: 'Pat the Nubbins on your way past. It’s on the way to everywhere.',
        thanks: 'Perfect. That’s the best stop of the whole trip.',
      },
    },
  },
  feed: {
    fallback: {
      ask: 'A few of the Nubbins look hungry. Could you feed them?',
      thanks: 'Full tummies all round. Thank you.',
    },
    nubbin: {
      ask: '{name} keeps looking at the fruit basket, then at you, then at the basket.',
      thanks: '{name} eats with both hands and doesn’t look up.',
    },
    by: {
      fern: {
        ask: 'They’re all looking at me like I’ve hidden something. Feed them.',
        thanks: 'Fed and fat and happy. Now the beans can rest.',
      },
      marina: {
        ask: 'Time for a bite for your Nubbins. Rule seven: nobody sulks hungry.',
        thanks: 'Rule seven holds. Nobody’s sulking. Not even the limpet.',
      },
      sparks: {
        ask: 'Feed the Nubbins, quick! Mine would eat my boots. Nearly did.',
        thanks: 'Full tummies! Quiet at last. Mostly. They’re burping.',
      },
      clover: {
        ask: 'A snack for the little ones, please. Something warm and soft.',
        thanks: 'Every tummy full. Now they’ll nap, and so will I.',
      },
      pixel: {
        ask: 'Could you feed the Nubbins? The robot tried. It oiled them.',
        thanks: 'They ate real food. The robot is taking notes.',
      },
      luna: {
        ask: 'Feed them, please. Hungry Nubbins and a sleepy Keeper do not mix.',
        thanks: 'Tummies full. Good. Now nobody wakes me.',
      },
      ember: {
        ask: 'Feed your Nubbins. You can’t train an empty stomach.',
        thanks: 'Well fed. Now they’re ready for anything. Even Sir.',
      },
      byte: {
        ask: 'Nubbins need feeding. I made a chart. The chart agrees with me.',
        thanks: 'Chart updated. All meals recorded. A fine result.',
      },
      dusty: {
        ask: 'Feed a few Nubbins. Everything gets hungry, even old eggs.',
        thanks: 'Hm. Good eating. I’d have fed them dirt. Yours was better.',
      },
      nova: {
        ask: 'Feed some Nubbins? I’ve met hungry ones in far places. Never again.',
        thanks: 'Fed, as promised. I always say the road starts at the table.',
      },
    },
  },
  fruit: {
    fallback: {
      ask: 'There’s fruit lying under the trees. Could you collect some?',
      thanks: 'Nice. That will keep the pantry going.',
    },
    nubbin: {
      ask: '{name} points a stubby arm at the fruit trees, then does a hopeful hop.',
      thanks: '{name} hugs a pear far too big for it.',
    },
    by: {
      fern: {
        ask: 'The fruit trees are showing off. Pick up what they drop.',
        thanks: 'Good haul. The tree will pretend it didn’t mind.',
      },
      marina: {
        ask: 'Pick up the fruit under the trees before the gulls get ideas.',
        thanks: 'Fruit in hand and no gulls involved. Splendid.',
      },
      sparks: {
        ask: 'Grab some fruit! Run for it. The ground’s too slow.',
        thanks: 'Got them all? Fast. Almost as fast as me. Almost.',
      },
      clover: {
        ask: 'Gather a bit of fruit for the pantry. Little ones love a pear.',
        thanks: 'Lovely. I’ll make a compote. And three cakes. Possibly four.',
      },
      pixel: {
        ask: 'I need fruit. Not for a machine. For a snack. A machine snack.',
        thanks: 'Fruit received. The robot has eaten one. Now it’s humming.',
      },
      luna: {
        ask: 'Pick up some fruit. It’s lying around. I can’t be the one to bend.',
        thanks: 'Thank you. I ate one lying down. Efficient.',
      },
      ember: {
        ask: 'Pick up fruit from the grass. Squats count. Bend with your knees.',
        thanks: 'Excellent bending. Fruit goes in the basket, form in the book.',
      },
      byte: {
        ask: 'Fruit is on the ground. Collecting it takes roughly four minutes.',
        thanks: 'Done in three minutes forty. Faster than predicted. Noted.',
      },
      dusty: {
        ask: 'Pick up the fallen fruit. A fruit is just a seed on its day out.',
        thanks: 'Nicely done. I’ll keep the stones for later digging.',
      },
      nova: {
        ask: 'Pick up some fruit. It travels well, and so do you.',
        thanks: 'Perfect. A good pocketful is worth a day’s walk.',
      },
    },
  },
  race: {
    fallback: {
      ask: 'Could you win a race? It would be lovely to see.',
      thanks: 'What a win! The whole Grove heard.',
    },
    nubbin: {
      ask: '{name} keeps sitting by the race track, looking hopeful.',
      thanks: '{name} does a little lap of honour.',
    },
    by: {
      fern: {
        ask: 'Win a race and I’ll make you a pie. A small one. A really small one.',
        thanks: 'You won! The hens are cheering, in their way.',
      },
      marina: {
        ask: 'Win a race. I’ll be on the bank with the flag. Rule four applies.',
        thanks: 'Fine work. I shall tell the gulls. They will not care.',
      },
      sparks: {
        ask: 'Win one race. I’ll be at the rail, being normal about it.',
        thanks: 'I was NOT crying, it was dust.',
      },
      clover: {
        ask: 'Win a race, if it isn’t too noisy? I’ll hold the blanket.',
        thanks: 'You won! My heart did a lap too. A slow one.',
      },
      pixel: {
        ask: 'Win a race! I built a finish-line bell. It’s only slightly alarming.',
        thanks: 'Ding! Ding! You won. The bell is still going. Sorry.',
      },
      luna: {
        ask: 'Win a race. I’ll watch from here. With my eyes closed. Listening.',
        thanks: 'I heard the cheering. You won. I’m wide awake, nearly.',
      },
      ember: {
        ask: 'Win a race. Fight smart, breathe, and save your last push.',
        thanks: 'Champion. Fists up! Well, arms up. That’s the same thing.',
      },
      byte: {
        ask: 'Win a race. I’ve got the stopwatch. I’ve got three. Don’t make it four.',
        thanks: 'Record logged, pending verification. It looks genuine.',
      },
      dusty: {
        ask: 'Win a race. Slow wins races too. Very old creatures prove it.',
        thanks: 'Won! Easily the finest result since the first egg.',
      },
      nova: {
        ask: 'Win a race. I’ve seen finish lines at the far edge. This one’s better.',
        thanks: 'Home first. That’s the best sort of finish line.',
      },
    },
  },
  karate: {
    fallback: {
      ask: 'Care for a bout at the dojo? A win would be grand.',
      thanks: 'Splendid bout. Well fought.',
    },
    nubbin: {
      ask: '{name} stands by the dojo door and throws one very small punch.',
      thanks: '{name} bows. Properly. Then falls over, and is delighted.',
    },
    by: {
      fern: {
        ask: 'Someone’s squaring up at the dojo. Go and win a bout.',
        thanks: 'Bravely done. The mat is still warm.',
      },
      marina: {
        ask: 'Win a bout at the dojo. Bow first. The sea teaches that too.',
        thanks: 'A clean win. I’ll add a rule about it.',
      },
      sparks: {
        ask: 'Win a karate bout! Do the kick. The one with the spin. I’ll watch.',
        thanks: 'I watched the whole thing. Mostly with my hands over my eyes.',
      },
      clover: {
        ask: 'Win a bout at the dojo, if you like. Do mind the little ones nearby.',
        thanks: 'Well done, dear. Nobody was hurt. Even the mat looks content.',
      },
      pixel: {
        ask: 'Win a bout at the dojo. The punch-counter I built might help.',
        thanks: 'Counter says four hits, no misses. It’s very smug.',
      },
      luna: {
        ask: 'Win a bout? Fine. Don’t wake me till you’ve done it.',
        thanks: 'Won? Good. I won a nap. Different sport, same pride.',
      },
      ember: {
        ask: 'Win a bout at the dojo. Fall first, hit second. Hazel’s rule.',
        thanks: 'Properly fought. Sir would be proud. Sir is a scarecrow.',
      },
      byte: {
        ask: 'Win one bout at the dojo. I’ll keep score. Lightly.',
        thanks: 'Win logged. Seven points, two bows, one tidy exit.',
      },
      dusty: {
        ask: 'Win a bout. A dojo mat is a good place to dig up old manners.',
        thanks: 'Good bout. As the ground says, patience wins.',
      },
      nova: {
        ask: 'Win a karate bout. I’ve seen bouts on three mountains. Yours should rank.',
        thanks: 'Nice. I’d tell the mountains, but they were never listening.',
      },
    },
  },
  lanterns: {
    fallback: {
      ask: 'The four lanterns are waiting for someone to light them.',
      thanks: 'Four lanterns. The Grove glows.',
    },
    nubbin: {
      ask: '{name} stares at the unlit lanterns, ears drooping a little.',
      thanks: '{name} watches the four lights glow and goes very still with joy.',
    },
    by: {
      fern: {
        ask: 'Light all four lanterns. The dark beds need a glow.',
        thanks: 'All four. The beans are impressed. Hard to tell.',
      },
      marina: {
        ask: 'Light all four lanterns. One for each corner of the tide.',
        thanks: 'Four lit. The pond has a few stars of its own.',
      },
      sparks: {
        ask: 'Light the four lanterns! Stand clear of the fourth. Please.',
        thanks: 'Four! None exploded. I’m a little disappointed.',
      },
      clover: {
        ask: 'Could you light all four lanterns? It’s cosy when they’re glowing.',
        thanks: 'Lovely. It looks like a lullaby now.',
      },
      pixel: {
        ask: 'Light all four lanterns. I rewired them. They’ll glow on cue.',
        thanks: 'Four bright lights, no flicker. My wiring wins.',
      },
      luna: {
        ask: 'Light the four lanterns. I’ll keep my eyes shut. They’re too bright.',
        thanks: 'Mm. Warm glow. I’ll doze here while it lasts.',
      },
      ember: {
        ask: 'Light all four lanterns. A watchful light is a fighter’s friend.',
        thanks: 'All lit. The scarecrow looks almost friendly.',
      },
      byte: {
        ask: 'Light all four lanterns. I’ll note how long each takes.',
        thanks: 'Four lit in good order. Elegant. I’d give it ninety per cent.',
      },
      dusty: {
        ask: 'Light all four lanterns. Old lamps like to be lit properly.',
        thanks: 'Four lanterns, glowing. An old kind of good.',
      },
      nova: {
        ask: 'Light all four lanterns. A lit lantern is the best signpost.',
        thanks: 'Four lights. You can see the Grove from far off now.',
      },
    },
  },
};
