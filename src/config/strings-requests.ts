/**
 * R0327 (FUN-38): the request board's asks in the askers' own voices. Each kind of request
 * (`sim/quests.ts` TEMPLATES) has a line for each Keeper who might ask it, a thank-you for
 * when it is claimed, and a fallback pair for anyone else. A Nubbin never speaks, so a
 * Nubbin's request is narrated (`nubbin`, with `{name}` for the Nubbin).
 */
export interface VoicePair {
  ask: string;
  thanks: string;
}

export interface RequestVoice {
  fallback: VoicePair;
  /** Narrated, for a request from one of the Grove's Nubbins; `{name}` is its name. */
  nubbin: VoicePair;
  by: Partial<Record<string, VoicePair>>;
}

export const REQUEST_VOICE: Record<string, RequestVoice> = {
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
  photo: {
    fallback: {
      ask: 'Could you take a photo of a Nubbin? It would be lovely to have.',
      thanks: 'What a picture. Thank you.',
    },
    nubbin: {
      ask: '{name} poses in front of everything. Hint taken.',
      thanks: '{name} holds a pose for far too long. It is a very good pose.',
    },
    by: {
      fern: {
        ask: 'Take a photo of one of the Nubbins. I’ll pin it by the potting shed.',
        thanks: 'A fine portrait. It’s going on the shed wall.',
      },
      marina: {
        ask: 'Take a photo of the right sort of Nubbin. I’ll frame it by the boots.',
        thanks: 'Lovely picture. It sits beside the crab now.',
      },
      sparks: {
        ask: 'Take a photo of a Nubbin! Quick, before it moves. Run!',
        thanks: 'Got it! A bit blurry. That’s motion. It’s on purpose.',
      },
      clover: {
        ask: 'Take a photo of a Nubbin, dear? I’d love one for the nursery.',
        thanks: 'What a sweet picture. I’ll hang it near the blankets.',
      },
      pixel: {
        ask: 'Take a photo of a Nubbin. My robot wants a new wallpaper.',
        thanks: 'Perfect. The robot has made it its screen. Very proud.',
      },
      luna: {
        ask: 'Take a photo of a Nubbin. Hold still. Very still. Like me.',
        thanks: 'Mm, nice. I’ll hang it above the bench for napping.',
      },
      ember: {
        ask: 'Take a photo of a Nubbin. Squared up, steady, then snap.',
        thanks: 'Clean shot. Training montage material.',
      },
      byte: {
        ask: 'Take a photo of a Nubbin. I’m compiling a catalogue. Index card ready.',
        thanks: 'Logged under P for photo. Crisp. Well framed.',
      },
      dusty: {
        ask: 'Take a photo of a Nubbin. I’d like to compare it with an old bone.',
        thanks: 'A fine likeness. I’ll file it near the spoons.',
      },
      nova: {
        ask: 'Take a photo of a Nubbin. I collect pictures from every place.',
        thanks: 'Beautiful. It goes in my bag next to the stones.',
      },
    },
  },
  visit: {
    fallback: {
      ask: 'A neighbour’s Grove would love a visit. Could you pop over?',
      thanks: 'Thank you for going. They’ll remember it.',
    },
    nubbin: {
      ask: '{name} sits at the gate, looking down the road toward the neighbours.',
      thanks: '{name} comes back from the gate with a leaf. It thinks it’s a souvenir.',
    },
    by: {
      fern: {
        ask: 'Visit a neighbour’s Grove. Take them a pie. Don’t say it’s mine.',
        thanks: 'You went? Good. Did they like the pie? Don’t tell me.',
      },
      marina: {
        ask: 'Visit a neighbour’s Grove. Say hello to their tide for me.',
        thanks: 'Nice. A visit is as good as a whole week of letters.',
      },
      sparks: {
        ask: 'Visit a neighbour’s Grove! Race there. Don’t race back. Well, do.',
        thanks: 'You’re back! Did you win? Don’t answer. I did.',
      },
      clover: {
        ask: 'Pop over to a neighbour’s Grove and wave. Kindness travels well.',
        thanks: 'Thank you for going. They’ll be smiling all week.',
      },
      pixel: {
        ask: 'Visit a neighbour’s Grove. Compare notes on garden machines.',
        thanks: 'Good. I’m told they have a better wheelbarrow. Brilliant.',
      },
      luna: {
        ask: 'Visit a neighbour’s Grove. I’d go, but the bench would miss me.',
        thanks: 'Back already? Nice. Tell me about it. Slowly.',
      },
      ember: {
        ask: 'Visit a neighbour’s Grove. Wave, bow, share a snack.',
        thanks: 'A good visit. I hope nobody challenged anyone.',
      },
      byte: {
        ask: 'Visit a neighbour’s Grove. I’d like a full report on their layout.',
        thanks: 'Report received. Their paths are not straight. Noted.',
      },
      dusty: {
        ask: 'Visit a neighbour’s Grove. Every garden has some old secret.',
        thanks: 'Glad you went. Anything buried? I’ll dig there next.',
      },
      nova: {
        ask: 'Visit a neighbour’s Grove. It’s my favourite sort of trip.',
        thanks: 'You’ve been! The road is better when it has company.',
      },
    },
  },
  craft: {
    fallback: {
      ask: 'Could you make something at the Workshop? Anything will do.',
      thanks: 'Nicely made. Thank you.',
    },
    nubbin: {
      ask: '{name} keeps carrying bits of wood to the workshop door.',
      thanks: '{name} sits on the new thing and refuses to give it up.',
    },
    by: {
      fern: {
        ask: 'Make something at the Workshop. Anything you like.',
        thanks: 'Made it with your own hands. The nicest sort of thing.',
      },
      marina: {
        ask: 'Make something in the workshop. Something sea-proof, if you can.',
        thanks: 'Solid work. I’d trust it on a boat. A small one.',
      },
      sparks: {
        ask: 'Make something in the workshop! Something that goes fast. Or bang.',
        thanks: 'You made it? Show me! Okay. Don’t press that. I pressed it.',
      },
      clover: {
        ask: 'Make something in the workshop, dear. A tiny hat, perhaps.',
        thanks: 'Oh, how clever. I’ll find a head for it.',
      },
      pixel: {
        ask: 'Make something in the workshop. Use my tiny screwdriver. Carefully.',
        thanks: 'Lovely work. Pixel approval: beep. Double beep.',
      },
      luna: {
        ask: 'Make something at the Workshop. I’ll watch from here. Supervising.',
        thanks: 'Pleasing. I admired it with my eyes closed.',
      },
      ember: {
        ask: 'Make something in the workshop. A good tool is a fine thing to own.',
        thanks: 'Strong work. A solid make. Hands that make things hit harder.',
      },
      byte: {
        ask: 'Make something in the workshop. Measure twice. I’ll bring the ruler.',
        thanks: 'Dimensions: correct. Finish: good. Result: pass.',
      },
      dusty: {
        ask: 'Make something in the workshop. Even a spoon is worth making.',
        thanks: 'Good. Someone will dig this up in a thousand years.',
      },
      nova: {
        ask: 'Make something in the workshop. I’d like to carry something you made.',
        thanks: 'Great. It rides in the bag, up front, next to the stone.',
      },
    },
  },
  water: {
    fallback: {
      ask: 'The crop plot looks thirsty. Could you give it some water?',
      thanks: 'Watered, and just in time. Thank you.',
    },
    nubbin: {
      ask: '{name} pats the dry soil of the crop plot, and looks at you.',
      thanks: '{name} splashes through a puddle by the plot, delighted.',
    },
    by: {
      fern: {
        ask: 'Water the crop plot, please. Slowly. Not at noon. Five past is better.',
        thanks: 'Good. The beans say thank you. Loudly. In bean.',
      },
      marina: {
        ask: 'Water the plants in the crop plot. Not too much. The sea is enough.',
        thanks: 'Just right. A good splash. Roots don’t need a flood.',
      },
      sparks: {
        ask: 'Water the crop plot! Go on, splash. Watch out for my boots.',
        thanks: 'Done! Fast. I only got a bit wet. Mostly.',
      },
      clover: {
        ask: 'Could you water the crop plot? The little shoots look thirsty.',
        thanks: 'Thank you. They’ll grow now. All of them. I’ll sing.',
      },
      pixel: {
        ask: 'Water the crop plot. I’ve been meaning to automate that. Soon.',
        thanks: 'Watered by hand. Which is, admittedly, a machine of sorts.',
      },
      luna: {
        ask: 'Water the crop plot. Quietly. Plants like a calm morning.',
        thanks: 'Done? Good. Even the plants went back to sleep.',
      },
      ember: {
        ask: 'Water the crop plot. Plants and fighters both need a drink.',
        thanks: 'Fine work. The beans look ready for a bout.',
      },
      byte: {
        ask: 'Water the crop plot. I’ll time the pour. Steady flow, please.',
        thanks: 'Complete. Flow rate: fine. Puddles: minimal. Good.',
      },
      dusty: {
        ask: 'Water the crop plot. Something may be sleeping under there.',
        thanks: 'Watered. If anything ancient wakes up, it’s on you.',
      },
      nova: {
        ask: 'Water the crop plot. Every place I visit has a thirsty plant.',
        thanks: 'Thanks. It stood up a bit straighter, I think.',
      },
    },
  },
  hug: {
    fallback: {
      ask: 'A few hugs would help. For the Nubbins, mostly.',
      thanks: 'That was a good round of hugs. Thank you.',
    },
    nubbin: {
      ask: '{name} holds both arms out and waits.',
      thanks: '{name} squeezes back and doesn’t let go. It takes a while.',
    },
    by: {
      fern: {
        ask: 'Give some hugs. Nubbins first. Then a Keeper, if one’s nearby.',
        thanks: 'Lovely. I felt that from the greenhouse.',
      },
      marina: {
        ask: 'Hug a few Nubbins. Hugs are rule number eight, if you’re counting.',
        thanks: 'Perfect. Rule eight: obeyed. Salt and sand included.',
      },
      sparks: {
        ask: 'Give some hugs! Hug fast. Hug hard. Hug while I’m looking away.',
        thanks: 'I looked. It’s fine. I’m fine. Hug me. No, don’t.',
      },
      clover: {
        ask: 'Give a few hugs, dear. They’re the best thing in the Grove.',
        thanks: 'Oh, that’s the nicest news. Thank you. I’m holding a hug too.',
      },
      pixel: {
        ask: 'Give some hugs. I’ve been told they’re good for circuits too.',
        thanks: 'The robot has been hugged. It’s buzzing. Productively.',
      },
      luna: {
        ask: 'Give some hugs. Long ones. Take your time. All afternoon, ideally.',
        thanks: 'Mm. That was very good. Now we nap.',
      },
      ember: {
        ask: 'Give some hugs. A strong person is a gentle one, too.',
        thanks: 'Good. That’s the hardest move. Best one, too.',
      },
      byte: {
        ask: 'Give some hugs. I’m recording hug frequency. For science.',
        thanks: 'Count met. Warmth detected. Results excellent.',
      },
      dusty: {
        ask: 'Give some hugs. Old things like a hug. Nobody tells them.',
        thanks: 'Good. Even the pebbles feel better. I could tell.',
      },
      nova: {
        ask: 'Give some hugs. Every place I’ve been had a good hug waiting.',
        thanks: 'A fine round of hugs. Best souvenir there is.',
      },
    },
  },
  lesson: {
    fallback: {
      ask: 'There’s a lesson waiting in the Learning Grove. Fancy finishing one?',
      thanks: 'Well done. You’ve learned something good.',
    },
    nubbin: {
      ask: '{name} peeks in at the Learning Grove and tilts its head.',
      thanks: '{name} sits upright, very serious, as if it had learned it too.',
    },
    by: {
      fern: {
        ask: 'Finish a lesson in the Learning Grove. It’s easier than weeding.',
        thanks: 'Well done. You learned something, and the hens didn’t even mind.',
      },
      marina: {
        ask: 'Finish a lesson in the Learning Grove. Rule nine: keep learning.',
        thanks: 'Rule nine, kept. The gulls will learn it later.',
      },
      sparks: {
        ask: 'Finish a lesson in the Learning Grove! Fast as you like. Speed counts.',
        thanks: 'Done? Quick. I only got halfway through mine. Slow.',
      },
      clover: {
        ask: 'Finish a lesson at the Learning Grove, dear. Take a biscuit.',
        thanks: 'Splendid. Learning and biscuits. The best pair.',
      },
      pixel: {
        ask: 'Finish a lesson in the Learning Grove. Brains are the best machines.',
        thanks: 'Well done. Your brain is a very fine machine. Beep.',
      },
      luna: {
        ask: 'Finish a lesson in the Learning Grove. I’ll nap through the dull bit.',
        thanks: 'Well done. You can tell me later. Much later.',
      },
      ember: {
        ask: 'Finish a lesson in the Learning Grove. Mind and body train together.',
        thanks: 'Good work. Sharp mind, steady guard.',
      },
      byte: {
        ask: 'Finish a lesson in the Learning Grove. I’ll tick it off. Tick.',
        thanks: 'Lesson complete. Mark entered. Tick. A very good tick.',
      },
      dusty: {
        ask: 'Finish a lesson in the Learning Grove. Old things teach, too.',
        thanks: 'Fine work. Learning is an old, old trick. Still works.',
      },
      nova: {
        ask: 'Finish a lesson in the Learning Grove. I picked up a lot on the road.',
        thanks: 'Brilliant. You’ve got a lesson in your pocket now.',
      },
    },
  },
  expedition: {
    fallback: {
      ask: 'Would you go on an Expedition? Come back safe.',
      thanks: 'Home safe. Thank you for going.',
    },
    nubbin: {
      ask: '{name} sits at the Grove’s edge, staring at the horizon.',
      thanks: '{name} runs to meet you at the gate, then forgets why.',
    },
    by: {
      fern: {
        ask: 'Go on an Expedition and come back safe. The Grove will be here.',
        thanks: 'Home again. Dusty boots, good. Safe, better.',
      },
      marina: {
        ask: 'Go on an Expedition and come home. I’ll leave the lamp on.',
        thanks: 'Back safe. Salt, sand, stories. Come in.',
      },
      sparks: {
        ask: 'Go on an Expedition! Run all the way. Bring me a shell. Bring me ten.',
        thanks: 'You’re back! Did you run? Don’t answer. Show me the loot.',
      },
      clover: {
        ask: 'Go on an Expedition, and come back with all your fingers. Please.',
        thanks: 'Oh, there you are. Welcome home. Sit down. Soup.',
      },
      pixel: {
        ask: 'Go on an Expedition. Take the robot. It wants to see the world.',
        thanks: 'Back! The robot has seen a hill. It won’t shut up about it.',
      },
      luna: {
        ask: 'Go on an Expedition. Wake me when it’s over. Tell me everything.',
        thanks: 'You’re back. I’m awake. Mostly. Go on, tell me.',
      },
      ember: {
        ask: 'Go on an Expedition. Find a hard road. Walk it twice.',
        thanks: 'Back again. Tougher than before. Good.',
      },
      byte: {
        ask: 'Go on an Expedition. Bring a map. Mark where you went. Time it.',
        thanks: 'Back on schedule. Route logged. Gold star.',
      },
      dusty: {
        ask: 'Go on an Expedition. Look down. Everything interesting is underfoot.',
        thanks: 'Back. Dirt on your boots. Good, that means you went.',
      },
      nova: {
        ask: 'Go on an Expedition and tell me about it. I’ll make us tea.',
        thanks: 'You’re home. The best part of any trip. Tea’s hot.',
      },
    },
  },
  gather: {
    fallback: {
      ask: 'Could you gather some materials? Anything useful will do.',
      thanks: 'A good gathering. Thank you.',
    },
    nubbin: {
      ask: '{name} drags a twig across the Grove and drops it at your feet.',
      thanks: '{name} builds a small pile and sits on top of it.',
    },
    by: {
      fern: {
        ask: 'Gather some materials. Sticks, stones, whatever turns up.',
        thanks: 'Good haul. I’ll make something sensible from it. Or not.',
      },
      marina: {
        ask: 'Gather some materials. Driftwood and rope, if you spot any.',
        thanks: 'Driftwood! The tide’s generous. Rule one holds.',
      },
      sparks: {
        ask: 'Gather some materials! Grab all you can carry. Then grab more.',
        thanks: 'That’s heaps. I’m using it all. Immediately. Stand back.',
      },
      clover: {
        ask: 'Gather some materials, dear. Wool, twigs, anything soft.',
        thanks: 'Oh, lovely. I can knit with that. Probably.',
      },
      pixel: {
        ask: 'Gather some materials. Cogs, springs, anything that clinks.',
        thanks: 'Excellent clinking. This will become something. Eventually.',
      },
      luna: {
        ask: 'Gather some materials. Whatever’s closest. I’m very comfortable here.',
        thanks: 'Nice pile. Closest is the best. I’ll look at it later.',
      },
      ember: {
        ask: 'Gather some materials. Lift with your legs. Carry it like a champion.',
        thanks: 'Strong carrying. Nothing dropped. Excellent.',
      },
      byte: {
        ask: 'Gather some materials. Count them as you go. Note the types.',
        thanks: 'Counted, sorted, filed. A pleasure to log.',
      },
      dusty: {
        ask: 'Gather some materials. Old things lie in odd places. Look carefully.',
        thanks: 'Fine finds. Some of this has a story. I can tell.',
      },
      nova: {
        ask: 'Gather some materials. A full bag is the right weight for a walk.',
        thanks: 'A good load. You’ve a good eye for the useful stuff.',
      },
    },
  },
  hollow: {
    fallback: {
      ask: 'Would you go down into the Hollow Below? Mind your step.',
      thanks: 'Back up safely. Well done.',
    },
    nubbin: {
      ask: '{name} peers into the Hollow and leans a little too far.',
      thanks: '{name} comes up from the steps and shakes dust off both ears.',
    },
    by: {
      fern: {
        ask: 'Go down into the Hollow Below. A few floors, then come up for supper.',
        thanks: 'Back up! Mud to the knees. That’s a good day’s digging.',
      },
      marina: {
        ask: 'Go down into the Hollow Below. Take a lamp. Come up for a warm drink.',
        thanks: 'Safe up. Wet or not, that’s the best way to come home.',
      },
      sparks: {
        ask: 'Go down into the Hollow Below! Run, jump, don’t look back. Look back, actually.',
        thanks: 'You’re up! I’d have gone faster. I’d also have got lost.',
      },
      clover: {
        ask: 'Go down into the Hollow Below, if you’re brave. I’ll keep a candle burning.',
        thanks: 'Oh, you’re back. I counted the stairs. All up. Thank you.',
      },
      pixel: {
        ask: 'Go down into the Hollow Below. Bring me any odd gadget you find.',
        thanks: 'Brilliant. A thing with gears. I’m keeping this. Thanks.',
      },
      luna: {
        ask: 'Go down into the Hollow Below. It’s quiet down there. I like that.',
        thanks: 'You went down? Good. It’s a restful kind of dark.',
      },
      ember: {
        ask: 'Go down into the Hollow Below. Mind your guard. Mind your step.',
        thanks: 'Back up safe. Dusty and proud. Training complete.',
      },
      byte: {
        ask: 'Go down into the Hollow Below. Count the floors. Mark every one.',
        thanks: 'Floors logged. Depth confirmed. Descent: efficient.',
      },
      dusty: {
        ask: 'Go down into the Hollow Below. The ground has been waiting down there.',
        thanks: 'Good. You’ve been where the old things sleep. Thank you.',
      },
      nova: {
        ask: 'Go down into the Hollow Below. I’ve been down some deep places. Wave for me.',
        thanks: 'You made it. Home is better after a deep place. Always.',
      },
    },
  },
};
