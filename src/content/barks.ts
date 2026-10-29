/**
 * R0295 (FUN-06): what the ten Keepers say when you tap one in the Grove outside a scene.
 * Each Keeper has an everyday set, a quiet set for the Long Night (chapters 9–11, where
 * nobody jokes much), and short sets for rain and for night. Every line is `all`, so the
 * Learning Grove reads the same words. Lines are one breath long and stay under 100
 * characters. The sim picks one with the seeded rng and never repeats a Keeper's last three
 * (`sim/campaign.ts`); the HUD shows it over the Keeper's head.
 */

export type BarkWhen = 'rain' | 'night';

export interface BarkSet {
  /** Chapters this set is said in, inclusive. */
  from: number;
  to: number;
  /** Only in this weather or at this time; absent for any time. */
  when?: BarkWhen;
  lines: readonly string[];
}

/** Chapters that keep their voices down: the Long Night and its edges. */
export const QUIET_CHAPTERS = { from: 9, to: 11 } as const;

const DAY = (lines: readonly string[]): BarkSet[] => [
  { from: 0, to: 8, lines },
  { from: 12, to: 99, lines },
];
const QUIET = (lines: readonly string[]): BarkSet => ({ ...QUIET_CHAPTERS, lines });
const RAIN = (lines: readonly string[]): BarkSet[] =>
  DAY(lines).map((s) => ({ ...s, when: 'rain' as const }));
const NIGHT = (lines: readonly string[]): BarkSet[] =>
  DAY(lines).map((s) => ({ ...s, when: 'night' as const }));

export const BARKS: Record<string, readonly BarkSet[]> = {
  fern: [
    ...DAY([
      'Checked the stone. Still there. Still a good stone.',
      'The pear tree and I have had words. I apologised. It did not.',
      'Mulch is just patience you can stand on.',
      'If you see a hen in the potting shed, you did not see a hen in the potting shed.',
      'I planted the beans in a straight line. They have other plans.',
      'Weeds are only flowers with ambition. Still pulling them.',
      'Hazel said never water at noon. So I water at five past.',
      'Your Nubbin ate a radish and looked betrayed. Fair.',
      'I talk to the seedlings. They are excellent listeners and terrible gossips.',
      'The stone has moved. Half an inch. I have my eye on it.',
      'There is a pie on a windowsill somewhere. Not mine. Probably.',
      'Dig, plant, wait. The waiting is the hard bit and the only bit that works.',
    ]),
    QUIET([
      'I covered the young beds tonight. Just in case.',
      'Keep the little ones close. That is all any of us can do.',
      'The stone is still there. I checked twice.',
    ]),
    ...RAIN([
      'Free water. I am not complaining. I am standing in it.',
      'The beans are delighted. The hens are not.',
      'Rain like this is the garden saying thank you, loudly.',
    ]),
    ...NIGHT([
      'Slugs work nights. So, apparently, do I.',
      'The night-scented stock is showing off. Smell that.',
      'Go to bed. The garden will still be here. Mostly.',
    ]),
  ],
  marina: [
    ...DAY([
      'Rule one: the tide is always right. Rule two: see rule one.',
      'Rule four: don’t be Sparks. It has saved lives.',
      'Found a crab in my boot. We have agreed to share.',
      'Swimmers need warm-ups. So do Keepers. Touch your toes. I’ll wait.',
      'The pond is not the sea. Do not tell the pond.',
      'Salt in the hair, sand in the socks. Good day, then.',
      'A Nubbin that can float is a Nubbin that can nap anywhere.',
      'I timed the stream. It is late again.',
      'Never turn your back on a wave, a goose or a Byte with a stopwatch.',
      'Rule six: dry your Nubbin’s ears. They will not thank you. Do it anyway.',
      'The gulls know my name. I don’t know how. I never told them.',
      'Today’s tide pools had two starfish and one very rude limpet.',
    ]),
    QUIET([
      'The water is very still tonight. I don’t like still.',
      'Rule one still holds. The tide comes back. It always comes back.',
      'Stay near the light, love. Just for now.',
    ]),
    ...RAIN([
      'Rain is just the sea visiting. Be polite.',
      'My swimmers love this. I am pretending to.',
      'Wet from above, wet from below. Perfect.',
    ]),
    ...NIGHT([
      'The pond has stars in it tonight. Don’t fish for them.',
      'Night swimming is for frogs and fools. I’m off to bed.',
      'Hear that? Tide turning, way off. You can always hear it at night.',
    ]),
  ],
  sparks: [
    ...DAY([
      'I only singed one eyebrow today. Personal best.',
      'Race you to the well. Go. Why are you not going?',
      'The fourth lantern is fine. It’s fine. Stand back a bit.',
      'Fastest Nubbin in the Grove? Mine. Ask anyone. Don’t ask Marina.',
      'If it sparks, it works. That’s science.',
      'I ran here. I’m going to run back. Then I’ll find out why I came.',
      'My boots have scorch marks on the inside. Don’t ask.',
      'Jumped the stream without a run-up. Nobody saw. It counts.',
      'Byte says my lap times are “optimistic”. Byte can catch me first.',
      'I fixed the bell. It now rings by itself. Improvement.',
      'Sit still? I can sit still. Watch. There. Done.',
      'If you smell smoke, it’s not me. If it’s blue smoke, it’s me.',
    ]),
    QUIET([
      'I’m not running tonight. Feels wrong to.',
      'All four lanterns are lit. I checked them myself. Properly.',
      'Stay with your little one. I’ll walk the long way round.',
    ]),
    ...RAIN([
      'Rain and sparks don’t mix. I have tested this. Twice.',
      'Puddle-jumping is a sport. I am the champion.',
      'My hair is flat. Do not look at my hair.',
    ]),
    ...NIGHT([
      'Lanterns on, all four. Well, three and a fizzle.',
      'Can’t sleep. Too much go in my legs.',
      'Night races are faster. That’s not true. It feels true.',
    ]),
  ],
  clover: [
    ...DAY([
      'My scarf is a bit longer today. I keep knitting when I’m nervous.',
      'Did your Nubbin have a good breakfast? Good. That’s all I wanted.',
      'I knitted a tiny hat. I have no idea who it fits yet.',
      'A soft word fixes most things. Biscuits fix the rest.',
      'I counted all the eggs twice. They’re all still eggs.',
      'You look tired. Sit down a moment. The Grove can wait.',
      'Babies hatch when they’re ready. Not a minute before. Not one.',
      'I hummed to the nursery and three of them hummed back. Nearly.',
      'If anyone needs a blanket, I have eleven. Twelve. I lost count.',
      'Gentle hands, warm milk, plenty of naps. For the Nubbins. Also me.',
      'The scarf has reached my knees. I may have a problem.',
      'I named a cloud after your Nubbin. It looked just like it.',
    ]),
    QUIET([
      'I’ve put warm stones in every nest. It helps a little.',
      'Hold them close tonight. Close is enough.',
      'I’m knitting. It keeps my hands from shaking.',
    ]),
    ...RAIN([
      'Everyone indoors, little ones. Mind the puddles.',
      'Rain on the roof is the best lullaby there is.',
      'My scarf is soaked. It is now very heavy and very long.',
    ]),
    ...NIGHT([
      'Shh. The nursery’s just gone off. Don’t breathe loudly.',
      'Goodnight, Grove. Goodnight, everyone in it.',
      'I always leave one candle on. For the late hatchers.',
    ]),
  ],
  pixel: [
    ...DAY([
      'My robot ran off again. If it beeps at you, wave. It likes that.',
      'Everything is a circuit if you squint.',
      'I rewired the wheelbarrow. It now reverses. Only reverses.',
      'Found a gear in the pond. Not mine. Probably mine.',
      'Your Nubbin pressed a button on my bench. Nothing exploded. Good sign.',
      'I am building a machine that waters plants. Fern says that’s called a can.',
      'Debugging is just apologising to a box until it forgives you.',
      'The robot learned to wave. Now it won’t stop.',
      'There’s a spring in my sock. I’m keeping it. It’s a good spring.',
      'Byte and I disagree about everything. It’s very productive.',
      'Tiny screwdriver, tiny screw, tiny success.',
      'The robot has a name now. It chose it. It’s a beep.',
    ]),
    QUIET([
      'The robot won’t leave my side tonight. Neither will I, from it.',
      'I fixed the lantern wiring. Everything that can stay lit, will.',
      'Some things you can’t fix. You can still sit with them.',
    ]),
    ...RAIN([
      'Rain plus circuits equals my robot under my coat.',
      'Water is the enemy. Also the coolant. It’s complicated.',
      'Everything I own is in a jar till this stops.',
    ]),
    ...NIGHT([
      'The robot glows in the dark now. Didn’t mean it to.',
      'Night is for soldering. Quiet hands, quiet Grove.',
      'If you see a little light wandering about, that’s just the robot.',
    ]),
  ],
  luna: [
    ...DAY([
      'Mm. Day. Wake me when it’s over.',
      'I’m not asleep. I’m resting my eyes in the shade, thoroughly.',
      'Moonflowers don’t open till dusk. Neither do I.',
      'The sun is very loud today.',
      'Ask me again at moonrise. I’ll have opinions then.',
      'This bench and I have an understanding.',
      'Your Nubbin is yawning. Good. It’s learning.',
      'Five more minutes. Five more hours. Whichever comes first.',
      'Day plants grow up. Night plants grow inward. Think about it. Later.',
      'Shh. The bench is thinking.',
      'I had a dream you’d come and talk to me. In it, you let me sleep.',
      'Morning is a rumour I’ve never confirmed.',
    ]),
    QUIET([
      'I’m awake. I’ll stay awake. Somebody should.',
      'The moon’s still up there. It never leaves. Remember that.',
      'Long nights are just nights that need more friends.',
    ]),
    ...RAIN([
      'Rain at noon is just night practising.',
      'Grey sky. Lovely. Almost bedtime.',
      'The moonflowers think it’s evening. Don’t correct them.',
    ]),
    ...NIGHT([
      'Ah. Now the Grove makes sense.',
      'The moonflowers are open. Come and look. Quietly.',
      'Night is when the garden tells you its secrets. Mostly about slugs.',
    ]),
  ],
  ember: [
    ...DAY([
      'Fought the scarecrow again. It won. It always wins. It doesn’t blink.',
      'Fists up, chin down, breakfast first.',
      'Strength is just doing the hard bit one more time.',
      'Your Nubbin threw a punch at a butterfly. Missed. Good form, though.',
      'Hazel taught me to fall before she taught me to hit. Best lesson I ever had.',
      'Fifty press-ups before breakfast. Forty-nine and a sit-down, anyway.',
      'A good fighter knows when not to. That’s most of the time.',
      'I’ve named the scarecrow. It’s called Sir. Out of respect.',
      'Sparring later? Bring snacks. Losing makes me hungry.',
      'The dojo floor needs sweeping. That’s training too, apparently.',
      'Breathe in, breathe out, don’t trip on the Nubbin.',
      'Ash says hello. Ash doesn’t speak. Ash says hello anyway.',
    ]),
    QUIET([
      'Nothing to punch tonight. Just a lot to stand in front of.',
      'I’ll keep watch by the gate. I’m good at standing still when it counts.',
      'I’m no good with words tonight. I’m good at standing in the right place.',
    ]),
    ...RAIN([
      'Training in the rain builds character. And colds.',
      'The scarecrow is wet. Its guard is down. Now’s my chance.',
      'Ash hates the rain. We’re inside. That’s an order.',
    ]),
    ...NIGHT([
      'One more round with the scarecrow. Then bed. Then another round.',
      'Night training is for quiet feet.',
      'Even fighters sleep. Eventually. Reluctantly.',
    ]),
  ],
  byte: [
    ...DAY([
      'Stopwatch five arrived. I’m not saying it’s a problem.',
      'Your Nubbin walked from the pond to here in eleven point two seconds. Noted.',
      'I measured the Grove. It’s bigger on Tuesdays. Investigating.',
      'Sparks’s lap time is wrong. Sparks says it is right. Data says Sparks is wrong.',
      'Logged it. Logged that too. Logging this conversation now.',
      'There are no bugs in my code. Only features with bad manners.',
      'The well is precisely seven metres deep. I asked a pebble.',
      'Stopwatch three has gone missing. Stopwatch four is grieving.',
      'Efficiency tip: carry two fruit. Don’t carry three. Trust me.',
      'Pixel’s robot beeped at me in a sarcastic tone. Robots can’t do that. Yet.',
      'Timed my lunch. Personal best. Regret it slightly.',
      'You took four seconds to say hello. Average is three. Just saying.',
    ]),
    QUIET([
      'I stopped the stopwatches. Didn’t seem right to count tonight.',
      'The lanterns hold for hours yet. I checked the numbers. Twice.',
      'Some things don’t go faster if you time them.',
    ]),
    ...RAIN([
      'Point four millimetres a minute. Steady drizzle. Classifying.',
      'Stopwatches inside the coat. Coat inside the shed. Me inside also.',
      'Rain falls at nine metres a second. Your Nubbin catches it slower.',
    ]),
    ...NIGHT([
      'The stars have very consistent timing. I respect them.',
      'Screen brightness down. Night mode. Very professional.',
      'Counting sheep is inefficient. I count stopwatches.',
    ]),
  ],
  dusty: [
    ...DAY([
      'Found a spoon. Ancient. Then I found another spoon. Also ancient. Hm.',
      'Everything is a fossil if you wait long enough. Including this conversation.',
      'Careful where you step. That rock might be a very old egg.',
      'Dig slow. The ground has been waiting a long time. It can wait for you.',
      'This pebble is older than the Grove. And still very rude.',
      'I brushed a stone for an hour. It was a stone. Good stone, though.',
      'The old ones hatched once. Patient, those eggs.',
      'Every shovelful is a page. Most pages say “dirt”.',
      'Third spoon. I’m starting to think somebody had a picnic.',
      'Bones tell stories. Spoons, it turns out, also tell stories. Mostly about soup.',
      'Hold your Nubbin up to the light. Lovely. Not a fossil. Yet.',
      'Mud is just time that’s gone soft.',
    ]),
    QUIET([
      'Old things last. That’s the whole point of them.',
      'I’ve dug up a lot of cold. This is the first I’ve had to sit through.',
      'Stay close to the warm. The ground remembers winters like this.',
    ]),
    ...RAIN([
      'Rain washes the top off things. Best time for finding.',
      'Mud. Glorious, revealing mud.',
      'The hill’s giving up its stones in this. Don’t tell anyone.',
    ]),
    ...NIGHT([
      'Lantern, trowel, patience. That’s the whole kit.',
      'Things look older at night. They aren’t. They just look it.',
      'Dug till the stars came out. Found a button.',
    ]),
  ],
  nova: [
    ...DAY([
      'I’m not lost. I’m finding the long way. On purpose.',
      'This map is upside down. Or the Grove is. One of us.',
      'I’ve been to the edge of the world. Twice. It was closed.',
      'Every path goes somewhere. Some of them go back here.',
      'Brought you a stone from far away. It looks like your stones. Far-away stones do.',
      'The best road is the one with a bench halfway along.',
      'I left my boots by the well. Then I left my other boots by the pond.',
      'If you hear of a mountain that sings, tell me. I owe it a visit.',
      'Packed my bag. Unpacked my bag. I’m staying a bit.',
      'Your Grove is my favourite stop. Don’t tell the other stops.',
      'Asked the river for directions. It just went on ahead.',
      'A wanderer’s secret: carry string. Nobody knows why. Carry string.',
    ]),
    QUIET([
      'I’ve walked through long nights before. They end. I promise.',
      'I’m not going anywhere tonight. Not even the long way.',
      'The stars still point home. I checked.',
    ]),
    ...RAIN([
      'Rain’s just a road coming down to meet you.',
      'Wet boots, good story. That’s the rule.',
      'I’ve had worse weather. I’ve had better company? No. I haven’t.',
    ]),
    ...NIGHT([
      'North is that way. Or that way. The stars are being vague.',
      'Night roads are quieter. Just you and the owls and the wrong turnings.',
      'Sit with me a minute. Let’s name a star something silly.',
    ]),
  ],
};
